using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OuDia
{
    public class Station
    {
        public string Name { get; set; }
        public string type { get; set; }
        public string size { get; set; }

        public bool kyoukaisen { get; set; }

        public Route route;

        public Station(Route route = null)
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
                            case "Ekimei":
                                Name = value.Replace("\\","");
                                break;
                            case "Ekijikokukeisiki":
                                type = value;
                                break;
                            case "Ekikibo":
                                size = value;
                                break;
                            case "Kyoukaisen":
                                kyoukaisen = value == "1";
                                break;
                            case "DiagramRessyajouhouHyoujiNobori":
                                //todo
                                break;
                            default:
                                throw new Exception("Invalid key "+ str);
                        }
                        break;
                }

            }
        }



    }
}
