using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OuDia
{
    public class Diagram
    {
        public string Name { get; set; }
        public Dia down { get; set; }
        public Dia up { get; set; }
        public Route route;

        public Diagram(Route route = null)
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
                    case "Kudari.":
                        down = new Dia(this);
                        down.Read(sr);
                        break;
                    case "Nobori.":
                        up = new Dia(this);
                        up.Read(sr);
                        break;
                    default:
                        if (!str.Contains("="))
                        {
                            throw new Exception(str);
                        }
                        var key = str.Split("=")[0];
                        var value = str.Split("=")[1];
                        switch (key)
                        {
                            case "DiaName":
                                Name = value;
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
