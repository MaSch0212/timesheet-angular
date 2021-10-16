using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;

namespace TimeSheet.Models
{
    public class Settings
    {
        private static SettingProperty[] _metadata;
        public static SettingProperty[] Metadata => _metadata ?? (_metadata = GetSettingsMetadata().ToArray());

        public static readonly double DefaultWorkDayHours = 8D;
        public static readonly bool DefaultInsertDefaultBreak = true;
        public static readonly double DefaultDefaultStart = 7.5D;
        public static readonly double DefaultDefaultEnd = 16.25D;
        public static readonly double DefaultDefaultBreakStart = 12D;
        public static readonly double DefaultDefaultBreakEnd = 12.75D;


        [SettingProperty(1, nameof(ParseDouble), nameof(DoubleToString))]
        public double WorkDayHours { get; set; } = DefaultWorkDayHours;

        [SettingProperty(2, nameof(ParseBool), nameof(BoolToString))]
        public bool InsertDefaultBreak { get; set; } = DefaultInsertDefaultBreak;

        [SettingProperty(3, nameof(ParseDouble), nameof(DoubleToString))]
        public double DefaultBreakStart { get; set; } = DefaultDefaultBreakStart;

        [SettingProperty(4, nameof(ParseDouble), nameof(DoubleToString))]
        public double DefaultBreakEnd { get; set; } = DefaultDefaultBreakEnd;

        [SettingProperty(5, nameof(ParseDouble), nameof(DoubleToString))]
        public double DefaultStart { get; set; } = DefaultDefaultStart;

        [SettingProperty(6, nameof(ParseDouble), nameof(DoubleToString))]
        public double DefaultEnd { get; set; } = DefaultDefaultEnd;

        public IList<ApiKey> ApiKeys { get; set; } = new List<ApiKey>();


        public static double ParseDouble(string toParse) => double.Parse(toParse, CultureInfo.InvariantCulture);
        public static string DoubleToString(double data) => data.ToString(CultureInfo.InvariantCulture);

        public static bool ParseBool(string toParse) => bool.Parse(toParse);
        public static string BoolToString(bool data) => data.ToString(CultureInfo.InvariantCulture);

        private static IEnumerable<SettingProperty> GetSettingsMetadata()
        {
            var type = typeof(Settings);
            var funcs = type.GetMethods(BindingFlags.Public | BindingFlags.Static).ToDictionary(x => x.Name);

            foreach (var p in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                var attr = p.GetCustomAttribute<SettingPropertyAttribute>();
                if (attr == null)
                    continue;

                var defaultValueField = type.GetField("Default" + p.Name, BindingFlags.Public | BindingFlags.Static);
                object defaultValue = defaultValueField?.GetValue(null) ?? (p.PropertyType.IsValueType ? Activator.CreateInstance(p.PropertyType) : null);

                yield return new SettingProperty(attr.SettingId, p, funcs[attr.ParseMethodName], funcs[attr.ToStringMethodName], defaultValue);
            }
        }

        [AttributeUsage(AttributeTargets.Property)]
        private class SettingPropertyAttribute : Attribute
        {
            public int SettingId { get; }
            public string ParseMethodName { get; }
            public string ToStringMethodName { get; }

            public SettingPropertyAttribute(int settingId, string parseMethodName, string toStringMethodName)
            {
                SettingId = settingId;
                ParseMethodName = parseMethodName;
                ToStringMethodName = toStringMethodName;
            }
        }

        public class SettingProperty
        {
            private readonly PropertyInfo _property;
            private readonly MethodInfo _parseMethod;
            private readonly MethodInfo _toStringMethod;

            public int Id { get; }
            public object DefaultValue { get; }
            public string Name => _property.Name;

            public SettingProperty(int id, PropertyInfo property, MethodInfo parse, MethodInfo toString, object defaultValue)
            {
                Id = id;
                DefaultValue = defaultValue;
                _property = property;
                _parseMethod = parse;
                _toStringMethod = toString;
            }

            public object GetValue(Settings settings) => _property.GetValue(settings);
            public T GetValue<T>(Settings settings) => (T)_property.GetValue(settings);
            public string GetString(Settings settings) => ValueToString(_property.GetValue(settings));

            public void SetValue<T>(Settings settings, T value) => _property.SetValue(settings, value);
            public void SetString(Settings settings, string value) => _property.SetValue(settings, StringToValue<object>(value));

            public string ValueToString<T>(T value) => (string)_toStringMethod.Invoke(null, new object[] { value });
            public T StringToValue<T>(string value) => (T)_parseMethod.Invoke(null, new object[] { value });
        }
    }
}
