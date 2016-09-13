using System;
using System.Collections.Generic;

// https://github.com/softwarejc/angularjs-crudgrid

namespace LO30.Data.Services.Interfaces
{
  public interface ICrudService<T> : IDisposable
  {
    T Add(T item);
    T Get(int id);
    IEnumerable<T> GetAll();
    bool Update(T updatedItem);
    bool Remove(int id);
    bool Any(int id);
  }
}