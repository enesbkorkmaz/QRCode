using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using QRCode.Server.Models;

namespace QRCode.Server.Data;

public partial class QrcodeDBContext : DbContext
{
    public QrcodeDBContext()
    {
    }

    public QrcodeDBContext(DbContextOptions<QrcodeDBContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Qrcode> Qrcodes { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    => optionsBuilder.UseNpgsql("Host=localhost;Database=qrcode;Username=qrcode;Password=123456");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Qrcode>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("qrcodes_pkey");

            entity.HasIndex(e => e.Guid, "idx_guid")
                .IsUnique()
                .HasAnnotation("Npgsql:StorageParameter:deduplicate_items", "false");

            entity.HasIndex(e => e.Url, "idx_url")
                .IsUnique()
                .HasAnnotation("Npgsql:StorageParameter:deduplicate_items", "false");

            entity.HasIndex(e => e.Guid, "unique_guid").IsUnique();

            entity.HasIndex(e => e.Url, "unique_url").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("nextval('qrcodes_id_seq'::regclass)")
                .HasColumnName("id");
            entity.Property(e => e.Guid)
                .HasMaxLength(36)
                .HasColumnName("guid");
            entity.Property(e => e.Url)
                .HasMaxLength(100)
                .HasColumnName("url");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Roles_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Desc)
                .HasMaxLength(100)
                .HasColumnName("desc");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .HasColumnName("name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");

            entity.HasIndex(e => e.Email, "idx_email")
                .IsUnique()
                .HasAnnotation("Npgsql:StorageParameter:deduplicate_items", "false");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Active)
                .HasDefaultValue(true)
                .HasColumnName("active");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasColumnName("email");
            entity.Property(e => e.Firstname)
                .HasMaxLength(50)
                .HasColumnName("firstname");
            entity.Property(e => e.Lastname)
                .HasMaxLength(50)
                .HasColumnName("lastname");
            entity.Property(e => e.Pwhash)
                .HasMaxLength(100)
                .HasColumnName("pwhash");
            entity.Property(e => e.Roleid).HasColumnName("roleid");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
