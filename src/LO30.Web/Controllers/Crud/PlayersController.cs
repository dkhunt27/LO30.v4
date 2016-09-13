using LO30.Data;
using LO30.Data.Services;
using LO30.Web.ViewModels.Crud;
using LO30.Web.ViewModels.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Crud
{
  [Route("api/crud/players")]
  public class PlayersController: Controller, ICrudService<PlayerViewModel>
  {
    private readonly IPlayersService _service;

    /// <summary>
    /// Initializes a new instance of the <see cref="PlayersController"/> class.
    /// </summary>
    public PlayersController(IPlayersService service)
    {
      // Injected service
      _service = service;
    }

    // Create 
    [ValidateModel]
    [HttpPost]
    public IActionResult Post(PlayerViewModel vm)
    {
      Player item = vm.MapToEntity();
      var addedItem = _service.Add(item);
      return CreatedAtRoute(new { id = addedItem.PlayerId }, addedItem);
    }

    // Read all 
    [HttpGet()]
    public IActionResult Get()
    {
      var allItems = _service.GetAll().Select(PlayerViewModel.MapFromEntity);
      return Json(allItems);
    }

    // Read by id
    [HttpGet("/{id:int}")]
    public IActionResult Get(int id)
    {
      var item = _service.Get(id);
      if (item == null)
      {
        NotFound();
      }

      return new ObjectResult(PlayerViewModel.MapFromEntity(item));
    }

    // Update
    [ValidateModel]
    [HttpPut()]
    public IActionResult Put([FromBody]PlayerViewModel vm)
    {
      // Item must exists
      if (vm.PlayerId == 0 || !_service.Any(vm.PlayerId))
      {
        return BadRequest(ServerConstants.UpdateError);
      }

      Player item = vm.MapToEntity();

      if (!_service.Update(item))
      {
        return NotFound(item);
      }

      return new NoContentResult();
    }

    // Delete
    [HttpDelete()]
    public IActionResult Delete(int id)
    {
      var item = _service.Get(id);
      if (item == null)
      {
        return NotFound(ServerConstants.DeleteError);
      }

      _service.Remove(id);
      return new NoContentResult();
    }
  }
}

