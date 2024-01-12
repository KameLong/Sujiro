using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OuDia
{
    public class Dia
    {
        public List<Train> trains { get; set; } = new List<Train>();
        public Diagram diagram;

        public Dia(Diagram diagram = null)
        {
            this.diagram = diagram;
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
                    case "Ressya.":
                        var train = new Train(this);
                        train.Read(sr);
                        trains.Add(train);
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
                            default:
                                throw new Exception("Invalid key " + str);
                        }
                        break;
                }

            }
        }   
    }
}
