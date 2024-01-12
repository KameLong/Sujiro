using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace OuDia
{
    public class TrainType
    {
        public Route route { get; set; }

        public string Name { get; set; }
        public string ShortName { get; set; }
        public string TextColor { get; set; }
        public int FontIndex { get; set; }

        public string DiaColor { get; set; }
        public string DiaStyle { get; set; }
        public string StopMarkType { get; set; }

        public int DiaBold { get; set; }

        public TrainType(Route route = null)
        {
            this.route = route;
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
                        var key = str.Split("=")[0];
                        var value = str.Split("=")[1];
                        switch (key)
                        {
                            case "Syubetsumei":
                                Name = value;
                                break;
                            case "Ryakusyou":
                                ShortName = value;
                                break;
                            case "JikokuhyouMojiColor":
                                TextColor = value;
                                break;
                            case "JikokuhyouFontIndex":
                                FontIndex = int.Parse(value);
                                break;
                            case "DiagramSenColor":
                                DiaColor = value;
                                break;
                            case "DiagramSenStyle":
                                DiaStyle = value;
                                break;
                            case "StopMarkDrawType":
                                StopMarkType = value;
                                break;
                            case "DiagramSenIsBold":
                                DiaBold = int.Parse(value);
                                break;
                            default:
                                throw new Exception("Invalid key "+str);
                        }
                        break;
                }

            }
        }

    }
}
