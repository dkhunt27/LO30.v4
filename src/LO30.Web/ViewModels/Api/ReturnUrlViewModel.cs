using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class ReturnUrlViewModel
  {
    [Required]
    public string ReturnUrl { get; set; }
  }
}