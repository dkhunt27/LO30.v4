using System;
using System.Collections.Generic;
using System.Linq;
using LO30.Data.Services.Interfaces;

namespace LO30.Data.Services
{
  public interface IScoreSheetEntrySubsService : ICrudService<ScoreSheetEntrySub>
  { }

  public class ScoreSheetEntrySubsService : IScoreSheetEntrySubsService
  {
    private LO30DbContext _lo30Context;
    private LO30ContextService _lo30ContextService;

    public ScoreSheetEntrySubsService(LO30DbContext context)
    {
      _lo30Context = context;
      _lo30ContextService = new LO30ContextService(context);
    }

    public ScoreSheetEntrySub Add(ScoreSheetEntrySub item)
    {
      _lo30ContextService.SaveOrUpdateScoreSheetEntrySub(item);
      return _lo30ContextService.FindScoreSheetEntrySub(item.ScoreSheetEntrySubId, errorIfNotFound: true, errorIfMoreThanOneFound: true, populateFully: true);
    }

    public ScoreSheetEntrySub Get(int id)
    {
      return _lo30ContextService.FindScoreSheetEntrySub(id, errorIfNotFound: false, errorIfMoreThanOneFound: true, populateFully: true);
    }

    public IEnumerable<ScoreSheetEntrySub> GetAll()
    {
      return _lo30Context.ScoreSheetEntrySubs.Where(x=>x.GameId >= 3616).ToList();
    }

    public bool Update(ScoreSheetEntrySub updatedItem)
    {
      // Null check
      if (updatedItem == null) return false;

      _lo30ContextService.SaveOrUpdateScoreSheetEntrySub(updatedItem);

      return true;
    }

    public bool Remove(int id)
    {
      var itemToRemove = _lo30ContextService.FindPlayer(id, errorIfNotFound: false, errorIfMoreThanOneFound: true, populateFully: false);
      if (itemToRemove == null) return false;
      var removed = _lo30Context.Players.Remove(itemToRemove);
      if (removed == null) return false;
      return true;
    }

    public bool Remove(string name)
    {
      throw new NotImplementedException();
    }

    public bool Any(int id)
    {
      return _lo30Context.Players.Any(item => item.PlayerId == id);
    }

    public bool Any(string name)
    {
      throw new NotImplementedException();
    }

    public void Dispose()
    {
      _lo30Context.Dispose();
    }
  }
}