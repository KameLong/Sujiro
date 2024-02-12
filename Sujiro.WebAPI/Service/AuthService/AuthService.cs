using Sujiro.Data;
using System.Security.Claims;

namespace Sujiro.WebAPI.Service.AuthService
{
    public class AuthService
    {
        public static string GetUserID(ClaimsPrincipal user)
        {
            return user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value??"";
        }
        public static bool HasAccessPrivileges(string DBdir,ClaimsPrincipal user,long companyID)
        {
            Company? company=Company.GetCompany(DBdir+"MASTER_DATA.sqlite",companyID);
            if(company == null)
            {
                return false;
            }
            if(company.UserID != GetUserID(user))
            {
                return false;
            }
            return true;
        }
    }
}
