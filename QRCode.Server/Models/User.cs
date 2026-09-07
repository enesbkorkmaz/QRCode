using System.ComponentModel.DataAnnotations.Schema; // YENİ EKLENDİ

namespace QRCode.Server.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public int Roleid { get; set; }

        [Column("active")]
        public bool Active { get; set; }

        public string Pwhash { get; set; } = null!;
    }
}