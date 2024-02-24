using System.Diagnostics;
using System.Text;

namespace OuDia
{
    public class LineFile
    {
        public string FileType { get; set; }
        public string FileTypeAppComment { get; set; }

        public List<Route> routes { get; set; }=new List<Route>();
        public DispProp dispProp { get; set; }

        /**
         * OuDiaファイルの読み込みを行います
         */
        public LineFile(string fileName)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            StreamReader sr = new StreamReader(fileName, Encoding.GetEncoding("Shift_JIS"));
            Read(sr);
        }
        public LineFile(Stream stream)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            StreamReader sr = new StreamReader(stream, Encoding.GetEncoding("Shift_JIS"));
            Read(sr);
        }

        public void Read(StreamReader sr)
        {
            while (true)
            {

                var str = sr.ReadLine();
                if (str == "."||str==null)
                {
                    return;
                }
                switch (str)
                {
                    case "Rosen.":
                        var route = new Route(this);
                        route.Read(sr);
                        routes.Add(route);
                        break;
                    case "DispProp.":
                        dispProp = new DispProp(this);
                        dispProp.Read(sr);
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
                            case "FileType":
                                FileType = value;
                                break;
                             case "FileTypeAppComment":
                                 FileTypeAppComment = value;
                                break;
                            default:
                                throw new Exception("Invalid key");
                        }
                        break;
                }
            }

        }
    }
}
