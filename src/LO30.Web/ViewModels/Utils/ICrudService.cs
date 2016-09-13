using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace LO30.Web.ViewModels.Utils
{
  public interface ICrudService<in T>
  {
    // CREATE
    IActionResult Post(T item);
    // READ ALL
    IActionResult Get();
    // READ By ID
    IActionResult Get(int id);
    // UPDATE
    IActionResult Put([FromBody] T updatedItem);
    // DELETE
    IActionResult Delete(int id);
  }
}
