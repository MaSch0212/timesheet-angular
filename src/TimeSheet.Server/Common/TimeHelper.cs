using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeSheet.Models;

namespace TimeSheet.Common
{
    public static class TimeHelper
    {

        public static bool TimesIntersects(DateTime startA, DateTime endA, DateTime startB, DateTime endB)
        {
            bool validA = startA <= endA;
            bool validB = startB <= endB;
            return !(validA && validB && (startA >= endB || startB >= endA));
        }

        public static bool IsTimeInSpan(DateTime startInner, DateTime endInner, DateTime startOuter, DateTime endOuter)
        {
            bool validInner = startInner <= endInner;
            bool validOuter = startOuter <= endOuter;
            return validInner && validOuter && startInner >= startOuter && endInner <= endOuter;
        }

        public static DateTime RoundMinutes(DateTime dt, int minutes)
        {
            var minutesToAdd = dt.Minute % minutes;
            if (minutesToAdd > minutes / 2)
                minutesToAdd = minutes - minutesToAdd;
            else
                minutesToAdd *= -1;
            var newDate = dt.AddMinutes(minutesToAdd);
            return new DateTime(newDate.Year, newDate.Month, newDate.Day, newDate.Hour, newDate.Minute, 0, dt.Kind);
        }

        public static bool CheckTimeSheetEntry(TimeSheetEntry entry, out string errorMessage)
        {
            errorMessage = null;
            if (entry.End.HasValue && entry.Start > entry.End.Value)
                errorMessage = "The Start time has to be earlier than the end time.";
            else if (entry.End.HasValue && entry.Start.Date != entry.End.Value.Date)
                errorMessage = "A entry has to be on one day.";
            else
            {
                for (int i = 0; i < entry.Breaks.Count && errorMessage == null; i++)
                {
                    var b = entry.Breaks[i];
                    if (b == null)
                        continue;
                    if (b.Start <= entry.Start)
                        errorMessage = $"The Start of break #{i + 1} has to be later than the start of the entry.";
                    else if (b.End.HasValue && entry.End.HasValue && b.End.Value >= entry.End.Value)
                        errorMessage = $"The End of break #{i + 1} has to be earlier than the end of the entry.";
                    else if (!b.End.HasValue && entry.End.HasValue)
                        errorMessage = $"The break #{i + 1} needs to have a end time because the entry has one.";
                    else
                    {
                        for (int j = i + 1; j < entry.Breaks.Count && errorMessage == null; j++)
                        {
                            var b2 = entry.Breaks[j];
                            if (b2 == null)
                                continue;
                            if(b.End.HasValue)
                            {
                                if (b2.End.HasValue && TimesIntersects(b.Start, b.End.Value, b2.Start, b2.End.Value))
                                    errorMessage = $"The breaks {i + 1} and {j + 1} intersects. This is not allowed.";
                            }
                            else
                            {
                                if (!b2.End.HasValue)
                                    errorMessage = $"Only one break can have no end. The breaks {i + 1} and {j + 1} have no end times.";
                                else if (b2.End.Value >= b.Start)
                                    errorMessage = $"A break with no end time has to be the last break. The break {i + 1} is not the last.";
                            }
                        }
                    }
                }
            }

            return errorMessage == null;
        }
    }
}
