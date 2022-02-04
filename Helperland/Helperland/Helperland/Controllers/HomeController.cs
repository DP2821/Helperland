﻿using Helperland.Data;
using Helperland.GlobalVariable;
using Helperland.Models;
using Helperland.Models.ViewModel;
using Helperland.Models.ViewModelRepository;
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

        HelperlandContext _helperlandContext;
    

        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger,HelperlandContext helperlandContext)
        {
            _logger = logger;
            _helperlandContext = helperlandContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(HomeViewModel homeViewModel)
        {
            User user = _helperlandContext.Users.Where(u => u.Email == homeViewModel.Login.Email).FirstOrDefault();

            if (user != null)
            {
                GlobalData globalData = new GlobalData();
                if (user.UserTypeId == globalData.CustomerTypeId)
                {
                    if (user.Password == homeViewModel.Login.Password)
                    {
                        Response.Cookies.Append("CurrentUserID", user.UserId + "");
                        Response.Cookies.Append("CurrentUserName", user.FirstName + "");


                        return RedirectToAction("TempCustomer");
                    }
                    else
                    {
                        Console.WriteLine("Email or password is wrong");
                        return RedirectToAction("Error");
                    }
                }
                else if (user.UserTypeId == globalData.SpTypeId)
                {
                    if (user.Password == homeViewModel.Login.Password)
                    {
                        Response.Cookies.Append("CurrentUserID", user.UserId + "");
                        Response.Cookies.Append("CurrentUserName", user.FirstName + "");


                        return RedirectToAction("TempServiceProvider");
                    }
                    else
                    {
                        Console.WriteLine("Email or password is wrong");
                        return RedirectToAction("Error");
                    }
                }
                else if (user.UserTypeId == globalData.AdminTypeId)
                {
                    if (user.Password == homeViewModel.Login.Password)
                    {
                        Response.Cookies.Append("CurrentUserID", user.UserId + "");
                        Response.Cookies.Append("CurrentUserName", user.FirstName + "");


                        return RedirectToAction("TempAdmin");
                    }
                    else
                    {
                        Console.WriteLine("Email or password is wrong");
                        return RedirectToAction("Error");
                    }
                }
                else
                {
                    Console.WriteLine("UserId is not valid");
                }
            }
            else
            {
                Console.WriteLine("User not found");
            }
                return RedirectToAction("Index");
        }

        public IActionResult ForgotPassword(HomeViewModel homeViewModel)
        {
            User user = _helperlandContext.Users.Where(u => u.Email == homeViewModel.Forgot.Email).FirstOrDefault();
            if (user != null)
            {
                var allChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%";
                var random = new Random();
                var resultToken = new string(
                   Enumerable.Repeat(allChar, 128)
                   .Select(token => token[random.Next(token.Length)]).ToArray());

                string token = resultToken.ToString();
                user.ResetToken = token;
                _helperlandContext.Users.Update(user);
                _helperlandContext.SaveChanges();

                var passwordResetLink = Url.Action("ResetPassword", "Home",
                    new { email = homeViewModel.Forgot.Email, token = token }, Request.Scheme);
                Console.WriteLine(passwordResetLink);
            }
            return RedirectToAction("Index");
        }

        public IActionResult ResetPassword(string email,string token)
        {
            User user = _helperlandContext.Users.Where(u => u.Email == email && u.ResetToken == token).FirstOrDefault();
            if(user != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public IActionResult ResetPassword(ResetPasswordViewModel resetPasswordViewModel)
        {

            User user = _helperlandContext.Users.Where(u => u.Email == resetPasswordViewModel.Email && u.ResetToken == resetPasswordViewModel.Token).FirstOrDefault();
            if (user != null)
            {
                user.Password = resetPasswordViewModel.Password;
                user.ResetToken = null;
                _helperlandContext.Users.Update(user);
                _helperlandContext.SaveChanges();
                return RedirectToAction("Index");
            }
            else
            {
                return RedirectToAction("Index");
            }
        }
        public IActionResult LogOut()
        {
            foreach (var cookie in HttpContext.Request.Cookies)
            {
                Response.Cookies.Delete(cookie.Key);
            }
            return RedirectToAction("Index");
        }
        [Route("become-a-service-provider")]
        public IActionResult BecomeProvider()
        {
            return View();
        }

        [HttpPost]
        [Route("become-a-service-provider")]
        public IActionResult BecomeProvider(BecomeProviderViewModel becomeProviderViewModel)
        {
            BecomeProviderRepository becomeProviderRepository = new BecomeProviderRepository();
            User user = becomeProviderRepository.GetUser(becomeProviderViewModel);
            _helperlandContext.Users.Add(user);
            _helperlandContext.SaveChanges();
            return RedirectToAction("Index");
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

        [Route("contact-us")]
        [HttpPost]
        public IActionResult Contact(ContactUViewModel viewContactU)
        {
            /*MailRequest mailRequest = new MailRequest();
            mailRequest.SendEmail(viewContactU.Email,viewContactU.FirstName,viewContactU.Subject,viewContactU.Message);*/

            _helperlandContext.ContactUs.Add(new ContactUsRepository().GetContactU(viewContactU));
            _helperlandContext.SaveChanges();
            return RedirectToAction("Index");
        }        

        [Route("signup")]
        public IActionResult SignUp()
        {
            return View();
        }

        [HttpPost]
        [Route("signup")]
        public IActionResult SignUp(SignUpViewModel signUpViewModel)
        {
            SignUpRepository signUpRepository = new SignUpRepository();
            User user = signUpRepository.GetUser(signUpViewModel);
            _helperlandContext.Users.Add(user);
            _helperlandContext.SaveChanges();
            return RedirectToAction("Index");
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult TempCustomer()
        {
            return View();
        }
        public IActionResult TempServiceProvider()
        {
            return View();
        }
        public IActionResult TempAdmin()
        {
            return View();
        }
    }
}