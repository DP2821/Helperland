using System.Text.Json;
using Helperland.Data;
using Helperland.Functionality;
using Helperland.GlobalVariable;
using Helperland.Models;
using Helperland.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace Helperland.Controllers
{
    public class AdminController : Controller
    {
        HelperlandContext _helperlandContext;
        MailRequest mailRequest = new MailRequest();


        public AdminController(HelperlandContext helperlandContext)
        {
            _helperlandContext = helperlandContext;
        }

        public IActionResult ServiceRequests()
        {
            int UsertypeId = new CurrentLoggedInUser().GetUserTypeId(Request.Cookies["keepMeLoggedInToken"]);
            if (UsertypeId != -1)
            {
                if (UsertypeId == new GlobalData().AdminTypeId)
                {
                    return View();
                }
                else
                {
                    //If user is logged in but not customer than simply redirect to Home.
                    return RedirectToAction("Index", "Home");
                }
            }
            else
            {
                //If user is not logged in than, will redirect to Home and open login modal
                return RedirectToAction("Index", "Home", new { loginModal = "true" });
            }
        }

        public string GetServiceRequests()
        {
            // int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

            var serviceRequests = (from sReq in _helperlandContext.ServiceRequests
                                   join sa in _helperlandContext.ServiceRequestAddresses on sReq.ServiceRequestId equals sa.ServiceRequestId
                                   join u in _helperlandContext.Users on sReq.UserId equals u.UserId
                                   select new
                                   {
                                       ServiceId = sReq.ServiceRequestId,
                                       ServiceStartDate = sReq.ServiceStartDate.ToString("d"),
                                       ServiceStartTime = sReq.ServiceStartDate.ToString("HH:mm"),
                                       ServiceTotalHour = sReq.ServiceHours + sReq.ExtraHours,
                                       TotalCost = sReq.TotalCost,

                                       CustomerName = u.FirstName + " " + u.LastName,
                                       Email = u.Email,

                                       AddressLine1 = sa.AddressLine1,
                                       AddressLine2 = sa.AddressLine2,
                                       City = sa.City,
                                       PostalCode = sa.PostalCode,


                                       ServiceProviderId = sReq.ServiceProviderId,
                                       ServiceProviderFirstName = _helperlandContext.Users.Where(user => user.UserId == sReq.ServiceProviderId).Select(user => user.FirstName).FirstOrDefault(),
                                       ServiceProviderLastName = _helperlandContext.Users.Where(user => user.UserId == sReq.ServiceProviderId).Select(user => user.LastName).FirstOrDefault(),
                                       AverageRatings = _helperlandContext.Ratings.Where(rat => rat.RatingTo == sReq.ServiceProviderId).Select(rat => rat.Ratings).ToList(),


                                       Status = sReq.Status,

                                   }).ToList();


            return JsonSerializer.Serialize(serviceRequests);
        }

        public string GetCityByZipCode(string postalcode)
        {
            var city = (from z in _helperlandContext.Zipcodes
                        join c in _helperlandContext.Cities on z.CityId equals c.Id
                        where z.ZipcodeValue == postalcode
                        select new
                        {
                            cityName = c.CityName
                        }).FirstOrDefault();
            if (city != null)
                return city.cityName;
            else
                return "false";
        }

        public string RescheduleService(int ServiceId, string NewServiceDate, string NewServicetime, string AddressLine1, string AddressLine2, string City, string PostalCode, string Reason)
        {
            string? userName = new CurrentLoggedInUser().GetName(Request.Cookies["keepMeLoggedInToken"]);

            ServiceRequest? serviceRequest = _helperlandContext.ServiceRequests.Where(sr => sr.ServiceRequestId == ServiceId).FirstOrDefault();

            if (serviceRequest != null)
            {
                if (serviceRequest.ServiceProviderId != null)
                {
                    var noOfServiceConflicting = _helperlandContext.ServiceRequests.Where(sr => sr.ServiceProviderId == serviceRequest.ServiceProviderId &&
                    sr.ServiceRequestId != serviceRequest.ServiceRequestId &&
                    (sr.Status == new GlobalData().SERVICE_REQUEST_STATUS_NEW || sr.Status == new GlobalData().SERVICE_REQUEST_STATUS_ACCEPTED) &&
                    DateTime.Compare(sr.ServiceStartDate.Date, DateTime.ParseExact(NewServiceDate + " " + NewServicetime, "yyyy-MM-dd HH:mm", null).Date) == 0 && !(
                        (TimeSpan.Compare(sr.ServiceStartDate.AddHours(sr.ServiceHours + (double)sr.ExtraHours + 1.0).TimeOfDay,
                            DateTime.ParseExact(NewServiceDate + " " + NewServicetime, "yyyy-MM-dd HH:mm", null).TimeOfDay) <= 0 &&
                        TimeSpan.Compare(sr.ServiceStartDate.AddHours(sr.ServiceHours + (double)sr.ExtraHours + 1.0).TimeOfDay,
                            DateTime.ParseExact(NewServiceDate + " " + NewServicetime, "yyyy-MM-dd HH:mm", null).AddHours(serviceRequest.ServiceHours + (double)serviceRequest.ExtraHours + 1.0).TimeOfDay) <= 0
                        ) ||
                        (TimeSpan.Compare(sr.ServiceStartDate.TimeOfDay,
                            DateTime.ParseExact(NewServiceDate + " " + NewServicetime, "yyyy-MM-dd HH:mm", null).TimeOfDay) >= 0) &&
                        TimeSpan.Compare(sr.ServiceStartDate.TimeOfDay,
                            DateTime.ParseExact(NewServiceDate + " " + NewServicetime, "yyyy-MM-dd HH:mm", null).AddHours(serviceRequest.ServiceHours + (double)serviceRequest.ExtraHours + 1.0).TimeOfDay) >= 0
                        )
                    ).FirstOrDefault();

                    if (noOfServiceConflicting != null)
                    {
                        string startMinute = noOfServiceConflicting.ServiceStartDate.Minute + "";
                        string endMinute = noOfServiceConflicting.ServiceStartDate.AddHours(noOfServiceConflicting.ServiceHours + (double)noOfServiceConflicting.ExtraHours).Minute + "";
                        if (noOfServiceConflicting.ServiceStartDate.Minute == 0)
                        {
                            startMinute = "00";
                        }
                        if (noOfServiceConflicting.ServiceStartDate.AddHours(noOfServiceConflicting.ServiceHours + (double)noOfServiceConflicting.ExtraHours).Minute == 0)
                        {
                            endMinute = "00";
                        }
                        return $"Another service request has been assigned to the service provider on {noOfServiceConflicting.ServiceStartDate.Day}-{noOfServiceConflicting.ServiceStartDate.Month}-{noOfServiceConflicting.ServiceStartDate.Year} from {noOfServiceConflicting.ServiceStartDate.Hour}:{startMinute} to {noOfServiceConflicting.ServiceStartDate.AddHours(noOfServiceConflicting.ServiceHours + (double)noOfServiceConflicting.ExtraHours).Hour}:{endMinute}. Either choose another date or pick up a different time slot";
                    }


                    var fevSP = _helperlandContext.Users.Where(u => u.UserId == serviceRequest.ServiceProviderId).Select(u => new { u.Email, u.FirstName, u.LastName }).FirstOrDefault();

                    if (fevSP != null)
                    {
                        SendMailViewModel sendMailViewModel = new SendMailViewModel();
                        sendMailViewModel.Email = fevSP.Email;
                        sendMailViewModel.Name = fevSP.FirstName + " " + fevSP.LastName;
                        sendMailViewModel.Subject = "Service Rescheduled";
                        sendMailViewModel.Body =
                        "Hello,\n" +
                        fevSP.FirstName + " " + fevSP.LastName + "\n\n" +
                        "Changes made by Admin" + "\n" +
                        userName + " has rescheduled service on\n" +
                        NewServiceDate + " " + NewServicetime + "\n" +
                        "Service ID: " + ServiceId;

                        Thread threadSendMail = new Thread(mailRequest.SendEmail);
                        threadSendMail.Start(sendMailViewModel);
                    }
                }


                var customer = _helperlandContext.Users.Where(u => u.UserId == serviceRequest.UserId).Select(u => new { u.Email, u.FirstName, u.LastName }).FirstOrDefault();
                if (customer != null)
                {
                    SendMailViewModel sendMailViewModel1 = new SendMailViewModel();
                    sendMailViewModel1.Email = customer.Email;
                    sendMailViewModel1.Name = customer.FirstName + " " + customer.LastName;
                    sendMailViewModel1.Subject = "Service Cancelled";
                    sendMailViewModel1.Body =
                    "Hello,\n" +
                    customer.FirstName + " " + customer.LastName + "\n\n" +
                    "Changes made by Admin" + "\n" +
                    userName + " has rescheduled service on\n" +
                    NewServiceDate + " " + NewServicetime + "\n" +
                    "Service ID: " + ServiceId;
                    Thread threadSendMail1 = new Thread(mailRequest.SendEmail);
                    threadSendMail1.Start(sendMailViewModel1);
                }
                int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

                serviceRequest.ServiceStartDate = DateTime.ParseExact(NewServiceDate + " " + NewServicetime, "yyyy-MM-dd HH:mm", null);
                serviceRequest.ModifiedDate = DateTime.Now;
                serviceRequest.ModifiedBy = userId;
                serviceRequest.Comments = Reason;
                _helperlandContext.ServiceRequests.Update(serviceRequest);

                var serviceAddress = _helperlandContext.ServiceRequestAddresses.Where(sa => sa.ServiceRequestId == ServiceId).FirstOrDefault();

                if (serviceAddress != null)
                {
                    serviceAddress.AddressLine1 = AddressLine1;
                    serviceAddress.AddressLine2 = AddressLine2;
                    serviceAddress.City = City;
                    serviceAddress.PostalCode = PostalCode;
                    _helperlandContext.ServiceRequestAddresses.Update(serviceAddress);
                    _helperlandContext.SaveChanges();
                }
                else
                {
                    return "Address not found by that id";
                }
            }
            else
            {
                return "No service found by that id";
            }
            return "true";
        }

        public string GetUsers()
        {
            var users = (from u in _helperlandContext.Users
                         select new
                         {
                             UserName = u.FirstName + " " + u.LastName,
                             DateOfRegistration = u.CreatedDate.ToString("d"),
                             Email = u.Email,
                             UserTypeId = u.UserTypeId,
                             Phone = u.Mobile,
                             PostalCode = u.ZipCode,
                             Status = u.Status
                         }).ToList();

            return JsonSerializer.Serialize(users);
        }

        public string ActivateDeActivateUser(string Status, string Email)
        {
            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);
            int StatusID = 0;
            if (String.Equals("Active", Status))
            {
                StatusID = 2;
            }
            else
            {
                StatusID = 1;
            }

            System.Console.WriteLine(StatusID);
            var user = _helperlandContext.Users.Where(u => u.Email == Email).FirstOrDefault();
            if (user != null)
            {
                user.Status = StatusID;
                user.ModifiedBy = userId;
                user.ModifiedDate = DateTime.Now;
                _helperlandContext.Users.Update(user);
                _helperlandContext.SaveChanges();
            }
            else
            {
                return "User not found";
            }
            return "true";
        }

        public string CancelService(int ServiceId, string Comments)
        {

            if (ModelState.IsValid)
            {
                ServiceRequest? serviceRequest = _helperlandContext.ServiceRequests.Find(ServiceId);
                string? userName = new CurrentLoggedInUser().GetName(Request.Cookies["keepMeLoggedInToken"]);
                if (serviceRequest != null)
                {
                    if (serviceRequest.ServiceProviderId != null)
                    {

                        var serviceProvider = _helperlandContext.Users.Where(u => u.UserId == serviceRequest.ServiceProviderId).Select(u => new { u.Email, u.FirstName, u.LastName }).FirstOrDefault();
                        if (serviceProvider != null)
                        {
                            SendMailViewModel sendMailViewModel = new SendMailViewModel();
                            sendMailViewModel.Email = serviceProvider.Email;
                            sendMailViewModel.Name = serviceProvider.FirstName + " " + serviceProvider.LastName;
                            sendMailViewModel.Subject = "Service Cancelled";
                            sendMailViewModel.Body =
                            "Hello,\n" +
                           serviceProvider.FirstName + " " + serviceProvider.LastName + "\n\n" +
                           userName + " has cancelled service\n" +
                           "Service ID: " + ServiceId + "\n" +
                           "Changes made by Admin";

                            Thread threadSendMail = new Thread(mailRequest.SendEmail);
                            threadSendMail.Start(sendMailViewModel);

                        }
                    }

                    var customer = _helperlandContext.Users.Where(u => u.UserId == serviceRequest.UserId).Select(u => new { u.Email, u.FirstName, u.LastName }).FirstOrDefault();
                    if (customer != null)
                    {
                        SendMailViewModel sendMailViewModel1 = new SendMailViewModel();
                        sendMailViewModel1.Email = customer.Email;
                        sendMailViewModel1.Name = customer.FirstName + " " + customer.LastName;
                        sendMailViewModel1.Subject = "Service Cancelled";
                        sendMailViewModel1.Body =
                        "Hello,\n" +
                        customer.FirstName + " " + customer.LastName + "\n\n" +
                        "Changes made by Admin" + "\n" +
                        userName + " has cancelled service\n" +
                        "Service ID: " + ServiceId + "\n";
                        Thread threadSendMail1 = new Thread(mailRequest.SendEmail);
                        threadSendMail1.Start(sendMailViewModel1);
                    }

                    int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

                    serviceRequest.Comments = Comments;
                    serviceRequest.Status = new GlobalData().SERVICE_REQUEST_STATUS_CANCELLED;
                    serviceRequest.ModifiedDate = DateTime.Now;
                    serviceRequest.ModifiedBy = userId;
                    _helperlandContext.ServiceRequests.Update(serviceRequest);
                    _helperlandContext.SaveChanges();
                }
                else
                {
                    return "No service found by that id";
                }

            }
            else
            {
                return "Something is missing";
            }

            return "true";
        }

    }
}
