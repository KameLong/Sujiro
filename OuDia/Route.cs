using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace OuDia
{
    public class Route
    {
        public string Name { get; set; }
        public int DiaStartTime { get; set; }
        public int DiaYDefault { get; set; }
        public string Comment { get; set; }
        public List<Station> Stations { get; set; } = new List<Station>();
        public List<TrainType> TrainTypes { get; set; } = new List<TrainType>();

        public List<Diagram> Diagrams { get; set; } = new List<Diagram>();
        public LineFile lineFile;


        public Route(LineFile lineFile = null)
        {
            this.lineFile = lineFile;
        }
        public void Read(StreamReader sr)
        {
            while (true)
            {
                var str=sr.ReadLine();
                switch (str)
                {
                    case ".": 
                        return;
                    case "Eki.":
                        var station = new Station(this);
                        station.Read(sr);
                        Stations.Add(station);
                        break;
                    case "Ressyasyubetsu.":
                        var type = new TrainType(this);
                        type.Read(sr);
                        TrainTypes.Add(type);
                        break;
                    case "Dia.":
                        var dia = new Diagram(this);
                        dia.Read(sr);
                        Diagrams.Add(dia);
                        break;
                    default:
                        if(!str.Contains("="))
                        {
                            throw new Exception(str);
                        }
                        var key = str.Split("=")[0];
                        var value = str.Split("=")[1];
                        switch (key)
                        {
                            case "Rosenmei":
                                Name = value;
                                break;
                            case "KitenJikoku":
                                var time=int.Parse(value);
                                DiaStartTime = (time / 100 * 3600) + (time % 100*60);
                                break;
                            case "DiagramDgrYZahyouKyoriDefault":
                                DiaYDefault = int.Parse(value);
                                break;
                            case "Comment":
                                Comment = value;
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
