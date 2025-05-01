import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from tqdm import tqdm
import torchvision
from torchvision import transforms
import matplotlib.pyplot as plt

class SimpleUNet(nn.Module):
    def __init__(self, input_channels=1, output_channels=1, hidden_size=64):
        super().__init__()
        # Initial conv
        self.conv1 = nn.Conv2d(input_channels + 1, hidden_size, 3, padding=1)  # +1 for time embedding
        
        # Downsampling
        self.down1 = nn.Conv2d(hidden_size, hidden_size * 2, 4, 2, 1)
        self.down2 = nn.Conv2d(hidden_size * 2, hidden_size * 4, 4, 2, 1)
        
        # Middle
        self.middle1 = nn.Conv2d(hidden_size * 4, hidden_size * 4, 3, padding=1)
        self.middle2 = nn.Conv2d(hidden_size * 4, hidden_size * 4, 3, padding=1)
        
        # Upsampling
        self.up1 = nn.ConvTranspose2d(hidden_size * 4, hidden_size * 2, 4, 2, 1)
        self.up2 = nn.ConvTranspose2d(hidden_size * 2, hidden_size, 4, 2, 1)
        
        # Output
        self.final = nn.Conv2d(hidden_size, output_channels, 3, padding=1)
        
    def forward(self, x, t):
        # Time embedding
        t = t.unsqueeze(-1).unsqueeze(-1)
        t = t.expand(-1, -1, x.shape[2], x.shape[3])
        x = torch.cat([x, t], dim=1)
        
        # Down path
        x1 = F.relu(self.conv1(x))
        x2 = F.relu(self.down1(x1))
        x3 = F.relu(self.down2(x2))
        
        # Middle
        x3 = F.relu(self.middle1(x3))
        x3 = F.relu(self.middle2(x3))
        
        # Up path
        x = F.relu(self.up1(x3))
        x = F.relu(self.up2(x))
        
        return self.final(x)

class SimpleDiffusion:
    def __init__(self, timesteps=1000, device="cpu"):
        self.timesteps = timesteps
        self.device = device
        self.beta = torch.linspace(1e-4, 0.02, timesteps).to(device)
        self.alpha = (1 - self.beta).to(device)
        self.alpha_bar = torch.cumprod(self.alpha, dim=0).to(device)
        
        self.model = SimpleUNet().to(device)
    
    def forward_process(self, x_0, t):
        """Add noise to the input image"""
        alpha_bar_t = self.alpha_bar[t]
        
        # Reshape for broadcasting
        alpha_bar_t = alpha_bar_t.view(-1, 1, 1, 1)
        
        # Generate random noise
        epsilon = torch.randn_like(x_0)
        
        # Add noise according to diffusion schedule
        x_t = torch.sqrt(alpha_bar_t) * x_0 + torch.sqrt(1 - alpha_bar_t) * epsilon
        
        return x_t, epsilon
    
    def sample(self, n_samples, img_size, device="cpu"):
        """Generate samples using the reverse process"""
        self.model.eval()
        with torch.no_grad():
            # Start from pure noise
            x = torch.randn(n_samples, 1, img_size, img_size).to(device)
            
            # Gradually denoise
            for t in tqdm(range(self.timesteps - 1, -1, -1)):
                t_batch = torch.full((n_samples,), t, device=device, dtype=torch.long)
                
                # Predict noise
                predicted_noise = self.model(x, t_batch.unsqueeze(1).float() / self.timesteps)
                
                alpha_t = self.alpha[t]
                alpha_bar_t = self.alpha_bar[t]
                beta_t = self.beta[t]
                
                if t > 0:
                    noise = torch.randn_like(x)
                else:
                    noise = 0
                
                x = (1 / torch.sqrt(alpha_t)) * (
                    x - (beta_t / (torch.sqrt(1 - alpha_bar_t))) * predicted_noise
                ) + torch.sqrt(beta_t) * noise
                
        return x
    
    def train_step(self, x_0, optimizer):
        """Single training step"""
        self.model.train()
        batch_size = x_0.shape[0]
        
        # Sample random timesteps
        t = torch.randint(0, self.timesteps, (batch_size,), device=x_0.device)
        
        # Forward process
        x_t, epsilon = self.forward_process(x_0, t)
        
        # Predict noise
        epsilon_pred = self.model(x_t, t.unsqueeze(1).float() / self.timesteps)
        
        # Calculate loss
        loss = F.mse_loss(epsilon_pred, epsilon)
        
        # Optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        return loss.item()

    def train(self, train_loader, num_epochs, device="cpu", save_interval=5):
        """Train the diffusion model"""
        self.model = self.model.to(device)
        optimizer = torch.optim.Adam(self.model.parameters(), lr=1e-4)
        
        for epoch in range(num_epochs):
            total_loss = 0
            for batch_idx, (data, _) in enumerate(tqdm(train_loader, desc=f"Epoch {epoch+1}/{num_epochs}")):
                data = data.to(device)
                loss = self.train_step(data, optimizer)
                total_loss += loss
                
            avg_loss = total_loss / len(train_loader)
            print(f"Epoch {epoch+1}/{num_epochs}, Average Loss: {avg_loss:.4f}")
            
            # Generate and save samples periodically
            if (epoch + 1) % save_interval == 0:
                self.save_samples(epoch + 1, device)
        
        return self.model

    def save_samples(self, epoch, device="cpu"):
        """Generate and save sample images"""
        self.model.eval()
        with torch.no_grad():
            # Generate samples
            samples = self.sample(n_samples=16, img_size=28, device=device)
            
            # Create grid of images
            grid = torchvision.utils.make_grid(samples, nrow=4, normalize=True)
            
            # Convert to numpy and transpose
            grid = grid.cpu().numpy().transpose((1, 2, 0))
            
            # Plot and save
            plt.figure(figsize=(8, 8))
            plt.imshow(grid, cmap='gray')
            plt.axis('off')
            plt.savefig(f'samples_epoch_{epoch}.png')
            plt.close()

# Example usage
if __name__ == "__main__":
    # Set device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # Load MNIST dataset
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,))
    ])
    
    train_dataset = torchvision.datasets.MNIST(
        root='./data', 
        train=True, 
        download=True, 
        transform=transform
    )
    
    train_loader = torch.utils.data.DataLoader(
        train_dataset,
        batch_size=128,
        shuffle=True,
        num_workers=2
    )
    
    # Create and train diffusion model
    diffusion = SimpleDiffusion(timesteps=1000, device=device)
    diffusion.train(train_loader, num_epochs=50, device=device)
    
    # Generate final samples
    samples = diffusion.sample(n_samples=16, img_size=28, device=device)
    print("Generated samples shape:", samples.shape) 