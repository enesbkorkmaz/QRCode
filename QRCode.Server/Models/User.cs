using System;
using System.Collections.Generic;

namespace QRCode.Server.Models;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public int Roleid { get; set; }

    public bool Active { get; set; }

    public string Pwhash { get; set; } = null!;
}
