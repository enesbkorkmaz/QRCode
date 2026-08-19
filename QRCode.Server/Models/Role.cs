using System;
using System.Collections.Generic;

namespace QRCode.Server.Models;

public partial class Role
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Desc { get; set; }
}
