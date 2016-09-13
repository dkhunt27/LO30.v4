using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace LO30.Web.ViewModels.Utils
{
  public class ValidateModelAttribute : ActionFilterAttribute
  {
    /// <summary>
    /// Occurs before the action method is invoked. Validates the model state.
    /// </summary>
    /// <param name="actionContext">The action context.</param>
    public override void OnActionExecuting(HttpActionContext actionContext)
    {
      if (!actionContext.ModelState.IsValid)
      {
        actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionContext.ModelState);
      }
      else if (actionContext.ActionArguments.ContainsValue(null))
      {
        actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Request body is empty.");
      }
    }
  }
}
