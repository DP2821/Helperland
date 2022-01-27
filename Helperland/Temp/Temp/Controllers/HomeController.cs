using Helperland.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace Helperland.Controllers
{
    public class HomeController : Controller
    {

        private readonly Demo2Context _demo2Context;
    

        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, Demo2Context demo2Context)
        {
            _logger = logger;
            _demo2Context = demo2Context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Route("become-a-service-provider")]
        public IActionResult BecomeProvider()
        {
            return View();
        }

        [Route("prices")]
        public IActionResult Prices()
        {
            return View();
        }

        [Route("contact-us")]
        public IActionResult Contact()
        {
            return View();
        }

        [Route("about")]
        public IActionResult About()
        {
            return View();
        }

        [Route("faqs")]
        public IActionResult Faq()
        {
            return View();
        }

        [Route("add-customer")]
        public IActionResult AddCustomer()
        {
            return View();
        }

        [HttpPost]
        [Route("add-customer")]
        public IActionResult AddCustomer(Customer customer)
        {
            _demo2Context.Customers.Add(customer);
            _demo2Context.SaveChanges();
            return RedirectToAction("Index");
        }

        [Route("list")]
        public IActionResult ListCustomer()
        {
            List<Customer> customer = _demo2Context.Customers.ToList();
            return View(customer);
        }

        public IActionResult Edit(int? id)
        {
            Customer customer = _demo2Context.Customers.Find(id);
            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer customer)
        {
            Console.WriteLine(customer);
            _demo2Context.Customers.Update(customer);
            _demo2Context.SaveChanges();
            return RedirectToAction("Index");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}