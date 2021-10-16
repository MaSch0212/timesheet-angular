using System;
using System.Collections.Generic;
using System.Linq;

namespace TimeSheet.Models
{
    public class TimeSheetEntry : ICloneable
    {
        public int Id { get; set; }
        public int SheetId { get; set; }
        public DateTime Start { get; set; }
        public DateTime? End { get; set; }
        public List<Break> Breaks { get; set; }
        public double TargetHours { get; set; }

        public TimeSheetEntry()
        {
            Breaks = new List<Break>();
        }

        object ICloneable.Clone() => this.Clone();
        public TimeSheetEntry Clone()
        {
            var result = this.MemberwiseClone() as TimeSheetEntry;
            result.Breaks = Breaks.Select(x => x.Clone()).ToList();
            return result;
        }
    }
}
