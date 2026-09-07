using System.ComponentModel.DataAnnotations.Schema; // YENİ: Sütun eşleştirme kütüphanesi

namespace QRCode.Server.Models
{
    public partial class Qrcode
    {
        public int Id { get; set; }
        public string Guid { get; set; } = null!;
        public string Url { get; set; } = null!;

        [Column("active")]
        public bool Active { get; set; }
    }
}