using System;
using System.Collections.Generic;
using System.Linq;
using LO30.Data.Services.Interfaces;

namespace LO30.Data.Services
{
  public interface IPlayersService : ICrudService<Player>
  { }

  public class PlayersService: IPlayersService
  {
    private LO30DbContext _lo30Context;
    private LO30ContextService _lo30ContextService;

    public PlayersService(LO30DbContext context)
    {
      _lo30Context = context;
      _lo30ContextService = new LO30ContextService(context);
    }

    public Player Add(Player item)
    {
      _lo30ContextService.SaveOrUpdatePlayer(item);
      return _lo30ContextService.FindPlayer(item.PlayerId, errorIfNotFound: true, errorIfMoreThanOneFound: true, populateFully: true);
    }

    public Player Get(int id)
    {
      return _lo30ContextService.FindPlayer(id, errorIfNotFound: false, errorIfMoreThanOneFound: true, populateFully: true);
    }

    public IEnumerable<Player> GetAll()
    {
      return _lo30Context.Players.ToList();
    }

    public bool Update(Player updatedItem)
    {
      // Null check
      if (updatedItem == null) return false;

      _lo30ContextService.SaveOrUpdatePlayer(updatedItem);

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