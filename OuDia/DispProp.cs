using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OuDia
{
    public class DispProp
    {
        public LineFile lineFile;
        public List<string> TimeTableFont { get; set; } = new List<string>();
        public string TimeTableVFont { get; set; }
        public string DiaStationFont { get; set; }
        public string DiaTimeFont { get; set; }
        public string DiaTrainFont { get; set; }
        public string CommentFont { get; set; }
        public string DiaTextColor { get; set; }
        public string DiaBackColor { get; set; }
        public string DiaLineColor { get; set; }
        public string DiaAxisColor { get; set; }
        public int stationNameWidth { get; set; }
        public int stationNameHeight { get; set; }

        public DispProp(LineFile lineFile = null)
        {
            this.lineFile = lineFile;
        }
        public void Read(StreamReader sr)
        {
            while (true)
            {
                var str = sr.ReadLine();
                switch (str)
                {
                    case ".":
                        return;
                    default:
                        if(!str.Contains("="))
                        {
                            throw new Exception(str);
                        }
                        var key = str.Split("=")[0];
                        var value = str.Split("=")[1];
                        switch (key)
                        {
                            case "JikokuhyouFont":
                                TimeTableFont.Add(value);
                                break;
                            case "JikokuhyouVFont":
                                TimeTableVFont = value;
                                break;
                            case "DiaEkimeiFont":
                                DiaStationFont = value;
                                break;
                            case "DiaJikokuFont":
                                DiaTimeFont = value;
                                break;
                            case "DiaRessyaFont":
                                DiaTrainFont = value;
                                break;
                            case "CommentFont":
                                CommentFont = value;
                                break;
                            case "DiaMojiColor":
                                DiaTextColor = value;
                                break;
                            case "DiaHaikeiColor":
                                DiaBackColor = value;
                                break;
                            case "DiaRessyaColor":
                                DiaLineColor = value;
                                break;
                            case "DiaJikuColor":
                                DiaAxisColor = value;
                                break;
                            case "EkimeiLength":
                                stationNameWidth = int.Parse(value);
                                break;
                            case "JikokuhyouRessyaWidth":
                                stationNameHeight = int.Parse(value);
                                break;
                            default:
                                throw new Exception("Invalid key " + str);
                        }
                        break;  
                }

            }
        }
    }
}
