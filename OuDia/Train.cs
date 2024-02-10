using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace OuDia
{
    public class Train
    {
        public Dia dia { get; set; }

        public string Direct { get; set; }
        public int Type { get; set; } = 0;
        public string Number { get; set; } = "";
        public string Name { get; set; } = "";
        public List<StationTime>times { get; set; } = new List<StationTime>();

        public string Comment { get; set; } = "";
        public string Gousuu { get; set; } = "";



        public Train(Dia dia = null)
        {
            this.dia = dia;
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
                            case "Houkou":
                                Direct = value;
                                break;
                            case "Syubetsu":
                                Type = int.Parse(value);
                                break;
                            case "Ressyabangou":
                                Number = value;
                                break;
                            case "Ressyamei":
                                Name = value;
                                break;
                            case "Bikou":
                                Comment = value;
                                break;
                            case "Gousuu":
                                Gousuu = value;
                                break;
                            case "EkiJikoku":
                                var timeStr= value.Split(",");
                                foreach(var t in timeStr)
                                {
                                    var time = new StationTime(this,t);
                                    times.Add(time);
                                }
                                for(int i=times.Count;i<dia.diagram.route.Stations.Count;i++)
                                {
                                    times.Add(new StationTime(this,""));
                                }
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
