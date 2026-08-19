using System;
using System.Collections.Generic;

namespace QRCode.Server.Models;

public partial class Qrcode
{
    public int Id { get; set; }

    public string Guid { get; set; } = null!;

    public string Url { get; set; } = null!;
}
