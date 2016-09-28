using LO30.Data;
using LO30.Data.Services;
using LO30.Web.ViewModels.Crud;
using LO30.Web.ViewModels.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Crud
{
  [Route("api/crud/scoreSheetEntrySubs")]
  public class ScoreSheetEntrySubsController : Controller, ICrudService<ScoreSheetEntrySubViewModel>
  {
    private readonly IScoreSheetEntrySubsService _service;

    /// <summary>
    /// Initializes a new instance of the <see cref="PlayersController"/> class.
    /// </summary>
    public ScoreSheetEntrySubsController(IScoreSheetEntrySubsService service)
    {
      // Injected service
      _service = service;
    }

    // Create 
    [ValidateModel]
    [HttpPost]
    public IActionResult Post(ScoreSheetEntrySubViewModel vm)
    {
      ScoreSheetEntrySub item = vm.MapToEntity();
      var addedItem = _service.Add(item);
      return CreatedAtRoute(new { id = addedItem.ScoreSheetEntrySubId }, addedItem);
    }

    // Read all 
    [HttpGet()]
    public IActionResult Get()
    {
      var allItems = _service.GetAll().Select(ScoreSheetEntrySubViewModel.MapFromEntity);
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

      return new ObjectResult(ScoreSheetEntrySubViewModel.MapFromEntity(item));
    }

    // Update
    [ValidateModel]
    [HttpPut()]
    public IActionResult Put([FromBody]ScoreSheetEntrySubViewModel vm)
    {
      // Item must exists
      if (vm.ScoreSheetEntrySubId == 0 || !_service.Any(vm.ScoreSheetEntrySubId))
      {
        return BadRequest(ServerConstants.UpdateError);
      }

      ScoreSheetEntrySub item = vm.MapToEntity();

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

