using LO30.Web.Models;
using LO30.Web.Models.Objects;
using LO30.Web.ViewModels.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LO30.Web.Services
{
  public class CriteriaService
  {
    private LO30DbContext _context;
    private List<DecadeSelectorViewModel> _decades;
    private List<Season> _seasons;
    private Season _selectedSeason;
    private int _selectedSeasonId;
    private string _selectedSeasonName;

    public CriteriaService(LO30DbContext context)
    {
      _decades = new List<DecadeSelectorViewModel>()
      {
        new DecadeSelectorViewModel() {
          DecadeName = "2010-2019",
          Seasons = new List<SeasonSelectorViewModel>()
          {
            new SeasonSelectorViewModel() { SeasonName = "2015 - 2016" },
            new SeasonSelectorViewModel() { SeasonName = "2014 - 2015" },
            new SeasonSelectorViewModel() { SeasonName = "2013 - 2014" },
            new SeasonSelectorViewModel() { SeasonName = "2012 - 2013" },
            new SeasonSelectorViewModel() { SeasonName = "2011 - 2012" },
            new SeasonSelectorViewModel() { SeasonName = "2010 - 2011" }
          }
        },
        new DecadeSelectorViewModel() {
          DecadeName = "2000-2009",
          Seasons = new List<SeasonSelectorViewModel>()
          {
            new SeasonSelectorViewModel() { SeasonName = "2009 - 2010" },
            new SeasonSelectorViewModel() { SeasonName = "2008 - 2009" },
            new SeasonSelectorViewModel() { SeasonName = "2007 - 2008" },
            new SeasonSelectorViewModel() { SeasonName = "2006 - 2007" },
            new SeasonSelectorViewModel() { SeasonName = "2005 - 2006" },
            new SeasonSelectorViewModel() { SeasonName = "2004 - 2005" },
            new SeasonSelectorViewModel() { SeasonName = "2003 - 2004" },
            new SeasonSelectorViewModel() { SeasonName = "2002 - 2003" },
            new SeasonSelectorViewModel() { SeasonName = "2001 - 2002" },
            new SeasonSelectorViewModel() { SeasonName = "2000 - 2001" }
          }
        },
        new DecadeSelectorViewModel() {
          DecadeName = "1990-1999",
          Seasons = new List<SeasonSelectorViewModel>()
          {
            new SeasonSelectorViewModel() { SeasonName = "1999 - 2000" },
            new SeasonSelectorViewModel() { SeasonName = "1998 - 1999" },
            new SeasonSelectorViewModel() { SeasonName = "1997 - 1998" },
            new SeasonSelectorViewModel() { SeasonName = "1996 - 1997" },
            new SeasonSelectorViewModel() { SeasonName = "1995 - 1996" },
            new SeasonSelectorViewModel() { SeasonName = "1994 - 1995" },
            new SeasonSelectorViewModel() { SeasonName = "1993 - 1994" },
            new SeasonSelectorViewModel() { SeasonName = "1992 - 1993" },
            new SeasonSelectorViewModel() { SeasonName = "1991 - 1992" },
            new SeasonSelectorViewModel() { SeasonName = "1990 - 1991" }
          }
        },
        new DecadeSelectorViewModel() {
          DecadeName = "1980-1989",
          Seasons = new List<SeasonSelectorViewModel>()
          {
            new SeasonSelectorViewModel() { SeasonName = "1989 - 1990" },
            new SeasonSelectorViewModel() { SeasonName = "1988 - 1989" },
            new SeasonSelectorViewModel() { SeasonName = "1987 - 1988" },
            new SeasonSelectorViewModel() { SeasonName = "1986 - 1987" },
            new SeasonSelectorViewModel() { SeasonName = "1985 - 1986" },
            new SeasonSelectorViewModel() { SeasonName = "1984 - 1985" },
            new SeasonSelectorViewModel() { SeasonName = "1983 - 1984" },
            new SeasonSelectorViewModel() { SeasonName = "1982 - 1983" },
            new SeasonSelectorViewModel() { SeasonName = "1981 - 1982" },
            new SeasonSelectorViewModel() { SeasonName = "1980 - 1981" }
          }
        },
        new DecadeSelectorViewModel() {
          DecadeName = "1970-1979",
          Seasons = new List<SeasonSelectorViewModel>()
          {
            new SeasonSelectorViewModel() { SeasonName = "1979 - 1980" },
            new SeasonSelectorViewModel() { SeasonName = "1978 - 1979" },
            new SeasonSelectorViewModel() { SeasonName = "1977 - 1978" },
            new SeasonSelectorViewModel() { SeasonName = "1976 - 1977" },
            new SeasonSelectorViewModel() { SeasonName = "1975 - 1976" },
            new SeasonSelectorViewModel() { SeasonName = "1974 - 1975" },
            new SeasonSelectorViewModel() { SeasonName = "1973 - 1974" },
            new SeasonSelectorViewModel() { SeasonName = "1972 - 1973" },
            new SeasonSelectorViewModel() { SeasonName = "1971 - 1972" },
            new SeasonSelectorViewModel() { SeasonName = "1970 - 1971" }
          }
        }
      };

      _context = context;

      _seasons = _context.Seasons.OrderByDescending(x => x.SeasonName).ToList();

      var season = _seasons.Where(x => x.IsCurrentSeason == true).SingleOrDefault();

      SetSelectedSeasonBySeason(season);
    }

    public Season SelectedSeason
    {
      get
      {
        return _selectedSeason;
      }
    }

    public int SelectedSeasonId
    {
      get
      {
        return _selectedSeasonId;
      }
    }

    public string SelectedSeasonName
    {
      get
      {
        return _selectedSeasonName;
      }
    }

    public List<Season> Seasons
    {
      get
      {
        return _seasons;
      }
    }

    public List<DecadeSelectorViewModel> Decades
    {
      get
      {
        return _decades;
      }
    }

    public void SetSelectedSeasonById(int seasonId)
    {
      var season = _seasons.Where(x => x.SeasonId == seasonId).SingleOrDefault();

      SetSelectedSeasonBySeason(season);
    }

    public void SetSelectedSeasonBySeason(Season season)
    {
      _selectedSeason = season;
      _selectedSeasonId = season.SeasonId;
      _selectedSeasonName = season.SeasonName;
    }
  }
}
