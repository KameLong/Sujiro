using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OuDia
{
    public class StationTime
    {
        public Train train;
        public int StopType { get; set; } = 0;
        public int AriTime { get; set; } = -1;
        public int DepTime { get; set; } = -1;

        public StationTime(Train train, string str)
        {
            this.train = train;
            if (str.Length == 0)
            {
                return;
            }

            if (!str.Contains(";"))
            {
                StopType = int.Parse(str);
                return;
            }
            var typeStr = str.Split(";")[0];
            var timeStr = str.Split(";")[1];
            StopType = int.Parse(typeStr);

            if (!timeStr.Contains("/"))
            {
                DepTime = time2int(timeStr);
                return;
            }
            else
            {
                var ariStr = timeStr.Split("/")[0];
                var depStr = timeStr.Split("/")[1];
                
                AriTime = time2int(ariStr);
                DepTime = time2int(depStr);
            }


        }
        static int time2int(string timeStr)
        {
            string hh = "";
            string mm = "";
            string ss = "0";

            switch (timeStr.Length)
            {
                case 3:
                    hh= timeStr.Substring(0, 1);
                    mm = timeStr.Substring(1, 2);
                    break;
                case 4:
                    hh = timeStr.Substring(0, 2);
                    mm = timeStr.Substring(2, 2);
                    break;
                case 5:
                    hh = timeStr.Substring(0, 1);
                    mm = timeStr.Substring(1, 2);
                    ss = timeStr.Substring(3, 2);
                    break;
                case 6:
                    hh = timeStr.Substring(0, 2);
                    mm = timeStr.Substring(2, 2);
                    ss = timeStr.Substring(4, 2);
                    break;
                default:
                    return -1;
            }
            return (int.Parse(hh) * 3600 + int.Parse(mm) * 60 + int.Parse(ss)+24*3600-3*3600)%(24*3600)+3*3600;
        }
    }
}
