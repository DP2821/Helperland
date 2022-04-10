using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Helperland.Models;

namespace Helperland.Data
{
    public partial class HelperlandContext : DbContext
    {
        public HelperlandContext()
        {
        }

        public HelperlandContext(DbContextOptions<HelperlandContext> options)
            : base(options)
        {
        }

        public virtual DbSet<City> Cities { get; set; } = null!;
        public virtual DbSet<ContactU> ContactUs { get; set; } = null!;
        public virtual DbSet<FavoriteAndBlocked> FavoriteAndBlockeds { get; set; } = null!;
        public virtual DbSet<Rating> Ratings { get; set; } = null!;
        public virtual DbSet<ServiceRequest> ServiceRequests { get; set; } = null!;
        public virtual DbSet<ServiceRequestAddress> ServiceRequestAddresses { get; set; } = null!;
        public virtual DbSet<ServiceRequestExtra> ServiceRequestExtras { get; set; } = null!;
        public virtual DbSet<State> States { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;
        public virtual DbSet<UserAddress> UserAddresses { get; set; } = null!;
        public virtual DbSet<Zipcode> Zipcodes { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=SQL5063.site4now.net,1433;Initial Catalog=db_a855b2_helperland;User Id=db_a855b2_helperland_admin;Password=0208dhruvil;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<City>(entity =>
            {
                entity.ToTable("City");

                entity.Property(e => e.CityName).HasMaxLength(50);

                entity.HasOne(d => d.State)
                    .WithMany(p => p.Cities)
                    .HasForeignKey(d => d.StateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_City_State");
            });

            modelBuilder.Entity<ContactU>(entity =>
            {
                entity.HasKey(e => e.ContactUsId);

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.Email).HasMaxLength(200);

                entity.Property(e => e.FileName)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.PhoneNumber).HasMaxLength(20);

                entity.Property(e => e.Subject).HasMaxLength(500);

                entity.Property(e => e.UploadFileName).HasMaxLength(100);
            });

            modelBuilder.Entity<FavoriteAndBlocked>(entity =>
            {
                entity.ToTable("FavoriteAndBlocked");

                entity.HasOne(d => d.TargetUser)
                    .WithMany(p => p.FavoriteAndBlockedTargetUsers)
                    .HasForeignKey(d => d.TargetUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FavoriteAndBlocked_User");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.FavoriteAndBlockedUsers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FavoriteAndBlocked_FavoriteAndBlocked");
            });

            modelBuilder.Entity<Rating>(entity =>
            {
                entity.ToTable("Rating");

                entity.Property(e => e.Comments).HasMaxLength(2000);

                entity.Property(e => e.Friendly).HasColumnType("decimal(2, 1)");

                entity.Property(e => e.OnTimeArrival).HasColumnType("decimal(2, 1)");

                entity.Property(e => e.QualityOfService).HasColumnType("decimal(2, 1)");

                entity.Property(e => e.RatingDate).HasColumnType("datetime");

                entity.Property(e => e.Ratings).HasColumnType("decimal(2, 1)");

                entity.HasOne(d => d.RatingFromNavigation)
                    .WithMany(p => p.RatingRatingFromNavigations)
                    .HasForeignKey(d => d.RatingFrom)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Rating_User");

                entity.HasOne(d => d.RatingToNavigation)
                    .WithMany(p => p.RatingRatingToNavigations)
                    .HasForeignKey(d => d.RatingTo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Rating_User1");

                entity.HasOne(d => d.ServiceRequest)
                    .WithMany(p => p.Ratings)
                    .HasForeignKey(d => d.ServiceRequestId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Rating_ServiceRequest");
            });

            modelBuilder.Entity<ServiceRequest>(entity =>
            {
                entity.ToTable("ServiceRequest");

                entity.Property(e => e.Comments).HasMaxLength(500);

                entity.Property(e => e.CreatedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Discount).HasColumnType("decimal(8, 2)");

                entity.Property(e => e.Distance).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ModifiedDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.PaymentTransactionRefNo).HasMaxLength(50);

                entity.Property(e => e.RefundedAmount).HasColumnType("decimal(8, 2)");

                entity.Property(e => e.ServiceHourlyRate).HasColumnType("decimal(8, 2)");

                entity.Property(e => e.ServiceStartDate).HasColumnType("datetime");

                entity.Property(e => e.SpacceptedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("SPAcceptedDate");

                entity.Property(e => e.SubTotal).HasColumnType("decimal(8, 2)");

                entity.Property(e => e.TotalCost).HasColumnType("decimal(8, 2)");

                entity.Property(e => e.ZipCode).HasMaxLength(10);

                entity.HasOne(d => d.ServiceProvider)
                    .WithMany(p => p.ServiceRequestServiceProviders)
                    .HasForeignKey(d => d.ServiceProviderId)
                    .HasConstraintName("FK_ServiceRequest_User1");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.ServiceRequestUsers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ServiceRequest_User");
            });

            modelBuilder.Entity<ServiceRequestAddress>(entity =>
            {
                entity.ToTable("ServiceRequestAddress");

                entity.Property(e => e.AddressLine1).HasMaxLength(200);

                entity.Property(e => e.AddressLine2).HasMaxLength(200);

                entity.Property(e => e.City).HasMaxLength(50);

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.Mobile).HasMaxLength(20);

                entity.Property(e => e.PostalCode).HasMaxLength(20);

                entity.Property(e => e.State).HasMaxLength(50);

                entity.HasOne(d => d.ServiceRequest)
                    .WithMany(p => p.ServiceRequestAddresses)
                    .HasForeignKey(d => d.ServiceRequestId)
                    .HasConstraintName("FK_ServiceRequestAddress_ServiceRequest");
            });

            modelBuilder.Entity<ServiceRequestExtra>(entity =>
            {
                entity.ToTable("ServiceRequestExtra");

                entity.HasOne(d => d.ServiceRequest)
                    .WithMany(p => p.ServiceRequestExtras)
                    .HasForeignKey(d => d.ServiceRequestId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ServiceRequestExtra_ServiceRequest");
            });

            modelBuilder.Entity<State>(entity =>
            {
                entity.ToTable("State");

                entity.Property(e => e.StateName).HasMaxLength(50);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.DateOfBirth).HasColumnType("datetime");

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.FirstName).HasMaxLength(100);

                entity.Property(e => e.LastName).HasMaxLength(100);

                entity.Property(e => e.Mobile).HasMaxLength(20);

                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.Password).HasMaxLength(100);

                entity.Property(e => e.PaymentGatewayUserRef).HasMaxLength(200);

                entity.Property(e => e.UserProfilePicture).HasMaxLength(200);

                entity.Property(e => e.ZipCode).HasMaxLength(20);
            });

            modelBuilder.Entity<UserAddress>(entity =>
            {
                entity.HasKey(e => e.AddressId)
                    .HasName("PK_UserAddresses");

                entity.ToTable("UserAddress");

                entity.Property(e => e.AddressLine1).HasMaxLength(200);

                entity.Property(e => e.AddressLine2).HasMaxLength(200);

                entity.Property(e => e.City).HasMaxLength(50);

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.Mobile).HasMaxLength(20);

                entity.Property(e => e.PostalCode).HasMaxLength(20);

                entity.Property(e => e.State).HasMaxLength(50);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserAddresses)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserAddresses_User");
            });

            modelBuilder.Entity<Zipcode>(entity =>
            {
                entity.ToTable("Zipcode");

                entity.Property(e => e.ZipcodeValue).HasMaxLength(50);

                entity.HasOne(d => d.City)
                    .WithMany(p => p.Zipcodes)
                    .HasForeignKey(d => d.CityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Zipcode_City");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }

}
