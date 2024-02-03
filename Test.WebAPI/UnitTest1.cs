using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Sujiro.Data;

namespace Test.WebAPI
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            try
            {

            MasterData.CreateMasterData(@"C:\Users\kamelong\Desktop\SujiroData\");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }



        }
    }
}