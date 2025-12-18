using Microsoft.AspNetCore.Mvc;

namespace IALWCB.Controllers.Controllers
{
    public class GameController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        // Это твоя секретная менюшка с Фредди
        public IActionResult SecretMenu()
        {
            return View();
        }
    }
}
