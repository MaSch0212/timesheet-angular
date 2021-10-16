using System;

namespace TimeSheet.Models
{
    public class Break : ICloneable
    {
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime? End { get; set; }

        object ICloneable.Clone() => this.Clone();
        public Break Clone()
        {
            return this.MemberwiseClone() as Break;
        }
    }
}
