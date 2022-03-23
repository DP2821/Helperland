using Helperland.Data;
using Helperland.Functionality;
using Helperland.GlobalVariable;
using Helperland.Models;
using Helperland.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text.Json;

namespace Helperland.Controllers
{
    public class ServiceProviderController : Controller
    {
        HelperlandContext _helperlandContext;
        MailRequest mailRequest = new MailRequest();
        MD5 md5Hash = MD5.Create();

        public ServiceProviderController(HelperlandContext helperlandContext)
        {
            _helperlandContext = helperlandContext;
        }

        public IActionResult Dashboard()
        {
            int UsertypeId = new CurrentLoggedInUser().GetUserTypeId(Request.Cookies["keepMeLoggedInToken"]);
            if (UsertypeId != -1)
            {
                if (UsertypeId == new GlobalData().SpTypeId)
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

        public string GetNewServices(string modal)
        {
            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

            var serviceRequests = (from sReq in _helperlandContext.ServiceRequests
                                   join sa in _helperlandContext.ServiceRequestAddresses on sReq.ServiceRequestId equals sa.ServiceRequestId
                                   join u in _helperlandContext.Users on sReq.UserId equals u.UserId
                                   where sReq.Status == new GlobalData().SERVICE_REQUEST_STATUS_NEW &&
                                   (bool)_helperlandContext.FavoriteAndBlockeds.Where(fv => fv.UserId == u.UserId && fv.TargetUserId == userId).Select(fv => fv.IsBlocked).FirstOrDefault() == false &&
                                   (bool)_helperlandContext.FavoriteAndBlockeds.Where(fv => fv.UserId == userId && fv.TargetUserId == u.UserId).Select(fv => fv.IsBlocked).FirstOrDefault() == false
                                   select new
                                   {
                                       ServiceId = sReq.ServiceRequestId,
                                       ServiceStartDate = sReq.ServiceStartDate.ToString("d"),
                                       ServiceStartTime = sReq.ServiceStartDate.ToString("HH:mm"),
                                       ServiceTotalHour = sReq.ServiceHours + sReq.ExtraHours,
                                       TotalCost = sReq.TotalCost,
                                       Comments = sReq.Comments,
                                       HasPets = sReq.HasPets,

                                       CustomerName = u.FirstName + " " + u.LastName,

                                       Conflict = _helperlandContext.ServiceRequests.Where(sr => sr.ServiceProviderId == userId &&
                                            sr.Status == new GlobalData().SERVICE_REQUEST_STATUS_ACCEPTED &&
                                            DateTime.Compare(sr.ServiceStartDate.Date, sReq.ServiceStartDate.Date) == 0 && !(
                                                (TimeSpan.Compare(sr.ServiceStartDate.AddHours(sr.ServiceHours + (double)sr.ExtraHours + 1.0).TimeOfDay,
                                                    sReq.ServiceStartDate.TimeOfDay) <= 0 &&
                                                TimeSpan.Compare(sr.ServiceStartDate.AddHours(sr.ServiceHours + (double)sr.ExtraHours + 1.0).TimeOfDay,
                                                    sReq.ServiceStartDate.AddHours(sReq.ServiceHours + (double)sReq.ExtraHours + 1.0).TimeOfDay) <= 0
                                                ) ||
                                                (TimeSpan.Compare(sr.ServiceStartDate.TimeOfDay,
                                                    sReq.ServiceStartDate.TimeOfDay) >= 0) &&
                                                TimeSpan.Compare(sr.ServiceStartDate.TimeOfDay,
                                                    sReq.ServiceStartDate.AddHours(sReq.ServiceHours + (double)sReq.ExtraHours + 1.0).TimeOfDay) >= 0
                                                )
                                            ).FirstOrDefault(),

                                       AddressLine1 = sa.AddressLine1,
                                       AddressLine2 = sa.AddressLine2,
                                       City = sa.City,
                                       PostalCode = sa.PostalCode,
                                       Mobile = sa.Mobile,
                                       Email = sa.Email,

                                       // ServiceExtraId = se.ServiceExtraId
                                       ServiceExtraId = _helperlandContext.ServiceRequestExtras.Where(u => u.ServiceRequestId == sReq.ServiceRequestId).Select(u => u.ServiceExtraId).ToList()

                                   }).ToList();


            return JsonSerializer.Serialize(serviceRequests);
        }

        public string AcceptService(int serviceId)
        {
            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

            if (userId != -1)
            {

                var newService = _helperlandContext.ServiceRequests.Where(sr => sr.ServiceRequestId == serviceId).FirstOrDefault();
                if (newService != null)
                {
                    int noOfServiceConflicting = _helperlandContext.ServiceRequests.Where(sr => 
                    sr.ServiceProviderId == userId && 
                    sr.Status == new GlobalData().SERVICE_REQUEST_STATUS_ACCEPTED &&
                    DateTime.Compare(sr.ServiceStartDate.Date, newService.ServiceStartDate.Date) == 0 && !(
                        (TimeSpan.Compare(sr.ServiceStartDate.AddHours(sr.ServiceHours + (double)sr.ExtraHours + 1.0).TimeOfDay,
                            newService.ServiceStartDate.TimeOfDay) <= 0 &&
                        TimeSpan.Compare(sr.ServiceStartDate.AddHours(sr.ServiceHours + (double)sr.ExtraHours + 1.0).TimeOfDay,
                            newService.ServiceStartDate.AddHours(newService.ServiceHours + (double)newService.ExtraHours + 1.0).TimeOfDay) <= 0
                        ) ||
                        (TimeSpan.Compare(sr.ServiceStartDate.TimeOfDay,
                            newService.ServiceStartDate.TimeOfDay) >= 0) &&
                        TimeSpan.Compare(sr.ServiceStartDate.TimeOfDay,
                            newService.ServiceStartDate.AddHours(newService.ServiceHours + (double)newService.ExtraHours + 1.0).TimeOfDay) >= 0
                        )
                    ).Count();

                    if (noOfServiceConflicting < 1)
                    {
                        newService.ServiceProviderId = userId;
                        newService.Status = new GlobalData().SERVICE_REQUEST_STATUS_ACCEPTED;
                        newService.ModifiedBy = userId;
                        newService.ModifiedDate = DateTime.Now;
                        _helperlandContext.ServiceRequests.Update(newService);
                        _helperlandContext.SaveChanges();

                        var blockList = _helperlandContext.FavoriteAndBlockeds.Where(u => u.UserId == newService.UserId && u.IsBlocked == true).Select(u => u.TargetUserId).ToList();

                        var spList = _helperlandContext.Users.Where(u => u.ZipCode == newService.ZipCode && u.UserTypeId == new GlobalData().SpTypeId && u.UserId != userId).Select(u => new { u.UserId, u.Email, u.FirstName, u.LastName }).ToList();
                        for (int i = 0; i < spList.Count; i++)
                        {
                            var serviceProviders = spList[i];
                            if (!blockList.Contains(serviceProviders.UserId))
                            {
                                SendMailViewModel sendMailViewModel = new SendMailViewModel();
                                sendMailViewModel.Email = serviceProviders.Email;
                                sendMailViewModel.Name = serviceProviders.FirstName + " " + serviceProviders.LastName;
                                sendMailViewModel.Subject = "Service unavailable";
                                sendMailViewModel.Body =
                                "Hello,\n" +
                                serviceProviders.FirstName + " " + serviceProviders.LastName + "\n\n" +
                                "Service ID: " + newService.ServiceRequestId + "\n" +
                                "this service request has already been accepted by someone and is no more available";

                                Thread threadSendMail = new Thread(mailRequest.SendEmail);
                                threadSendMail.Start(sendMailViewModel);
                            }
                        }
                    }
                    else
                    {
                        return "You can't pick this one because you have another service which is conflicting";
                    }
                }
                else
                {
                    return "Service has been assigned to another service provider";
                }
            }
            else
            {
                return "Please check your credential or login again";
            }
            return "true";
        }

        public string GetUpcomingServices(string s)
        {
            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

            var upcomingServices = (from sReq in _helperlandContext.ServiceRequests
                                    join sa in _helperlandContext.ServiceRequestAddresses on sReq.ServiceRequestId equals sa.ServiceRequestId
                                    join u in _helperlandContext.Users on sReq.UserId equals u.UserId
                                    where sReq.ServiceProviderId == userId && sReq.Status == new GlobalData().SERVICE_REQUEST_STATUS_ACCEPTED
                                    select new
                                    {
                                        ServiceId = sReq.ServiceRequestId,
                                        ServiceStartDate = sReq.ServiceStartDate.ToString("d"),
                                        ServiceStartTime = sReq.ServiceStartDate.ToString("HH:mm"),
                                        ServiceTotalHour = sReq.ServiceHours + sReq.ExtraHours,
                                        TotalCost = sReq.TotalCost,
                                        Comments = sReq.Comments,
                                        HasPets = sReq.HasPets,

                                        CustomerName = u.FirstName + " " + u.LastName,

                                        AddressLine1 = sa.AddressLine1,
                                        AddressLine2 = sa.AddressLine2,
                                        City = sa.City,
                                        PostalCode = sa.PostalCode,
                                        Mobile = sa.Mobile,
                                        Email = sa.Email,

                                        // ServiceExtraId = se.ServiceExtraId
                                        ServiceExtraId = _helperlandContext.ServiceRequestExtras.Where(u => u.ServiceRequestId == sReq.ServiceRequestId).Select(u => u.ServiceExtraId).ToList()

                                    }).ToList();


            return JsonSerializer.Serialize(upcomingServices);
        }

        public string CancelService(int serviceId)
        {
            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);
            if (userId != -1)
            {
                var service = _helperlandContext.ServiceRequests.Where(sr => sr.ServiceRequestId == serviceId).FirstOrDefault();

                if (service != null)
                {
                    service.Status = new GlobalData().SERVICE_REQUEST_STATUS_CANCELLED;
                    service.ModifiedBy = userId;
                    service.ModifiedDate = DateTime.Now;
                    _helperlandContext.ServiceRequests.Update(service);
                    _helperlandContext.SaveChanges();
                }
                else
                {
                    return "service not found by that id";
                }
            }
            else
            {
                return "Please check your credential or login again";
            }
            return "true";
        }

        public string CompleteService(int serviceId)
        {

            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);
            if (userId != -1)
            {
                var service = _helperlandContext.ServiceRequests.Where(sr => sr.ServiceRequestId == serviceId).FirstOrDefault();

                if (service != null)
                {
                    service.Status = new GlobalData().SERVICE_REQUEST_STATUS_COMPLETED;
                    service.ModifiedBy = userId;
                    service.ModifiedDate = DateTime.Now;
                    _helperlandContext.ServiceRequests.Update(service);
                    int noOfRowForThisCustomerAndSpInFevBlockedTabel = _helperlandContext.FavoriteAndBlockeds.Where(fb => fb.UserId == service.UserId && fb.TargetUserId == userId).Count();
                    System.Console.WriteLine("noOfRowForThisCustomerAndSpInFevBlockedTabel: " + noOfRowForThisCustomerAndSpInFevBlockedTabel);
                    if (noOfRowForThisCustomerAndSpInFevBlockedTabel == 0)
                    {
                        FavoriteAndBlocked favoriteAndBlocked = new FavoriteAndBlocked();
                        favoriteAndBlocked.UserId = service.UserId;
                        favoriteAndBlocked.TargetUserId = userId;
                        _helperlandContext.FavoriteAndBlockeds.Add(favoriteAndBlocked);
                    }
                    _helperlandContext.SaveChanges();

                    // FavoriteAndBlocked favoriteAndBlocked = new FavoriteAndBlocked();
                    // favoriteAndBlocked.UserId = 
                    // _helperlandContext.FavoriteAndBlockeds.Add();
                }
                else
                {
                    return "service not found by that id";
                }
            }
            else
            {
                return "Please check your credential or login again";
            }
            return "true";
        }

        public string GetServiceHistory(string s)
        {
            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

            var serviceHistory = (from sReq in _helperlandContext.ServiceRequests
                                  join sa in _helperlandContext.ServiceRequestAddresses on sReq.ServiceRequestId equals sa.ServiceRequestId
                                  join u in _helperlandContext.Users on sReq.UserId equals u.UserId
                                  where sReq.ServiceProviderId == userId && sReq.Status == new GlobalData().SERVICE_REQUEST_STATUS_COMPLETED
                                  select new
                                  {
                                      ServiceId = sReq.ServiceRequestId,
                                      ServiceStartDate = sReq.ServiceStartDate.ToString("d"),
                                      ServiceStartTime = sReq.ServiceStartDate.ToString("HH:mm"),
                                      ServiceTotalHour = sReq.ServiceHours + sReq.ExtraHours,
                                      TotalCost = sReq.TotalCost,
                                      Comments = sReq.Comments,
                                      HasPets = sReq.HasPets,

                                      CustomerName = u.FirstName + " " + u.LastName,

                                      AddressLine1 = sa.AddressLine1,
                                      AddressLine2 = sa.AddressLine2,
                                      City = sa.City,
                                      PostalCode = sa.PostalCode,
                                      Mobile = sa.Mobile,
                                      Email = sa.Email,

                                      // ServiceExtraId = se.ServiceExtraId
                                      ServiceExtraId = _helperlandContext.ServiceRequestExtras.Where(u => u.ServiceRequestId == sReq.ServiceRequestId).Select(u => u.ServiceExtraId).ToList()

                                  }).ToList();


            return JsonSerializer.Serialize(serviceHistory);
        }

        public string GetMyRatings(string s)
        {
            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

            var myRatings = (from r in _helperlandContext.Ratings
                             join u in _helperlandContext.Users on r.RatingFrom equals u.UserId
                             join sr in _helperlandContext.ServiceRequests on r.ServiceRequestId equals sr.ServiceRequestId
                             where r.RatingTo == userId
                             select new
                             {
                                 ServiceId = r.ServiceRequestId,
                                 CustomerName = u.FirstName + " " + u.LastName,
                                 ServiceStartDate = sr.ServiceStartDate.ToString("d"),
                                 ServiceStartTime = sr.ServiceStartDate.ToString("HH:mm"),
                                 ServiceTotalHour = sr.ServiceHours + sr.ExtraHours,

                                 Ratings = r.Ratings,
                                 Comments = r.Comments

                             }).ToList();

            return JsonSerializer.Serialize(myRatings);
        }

        public string GetFevouriteBlockedCustomerList()
        {
            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);


            var x = (from sr in _helperlandContext.ServiceRequests
                     join u in _helperlandContext.Users on sr.UserId equals u.UserId
                     where sr.ServiceProviderId == userId
                     select new
                     {
                         CustomerId = sr.UserId,
                         CustomerName = u.FirstName + " " + u.LastName,
                         IsBlocked = _helperlandContext.FavoriteAndBlockeds.Where(fv => fv.UserId == userId && fv.TargetUserId == sr.UserId).Select(fv => fv.IsBlocked).FirstOrDefault()
                     }).Distinct().ToList();
            return JsonSerializer.Serialize(x);

        }

        public string UpdateBlockedCustomer(int TargetUserId, bool IsBlocked)
        {

            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);
            FavoriteAndBlocked? favoriteAndBlocked = _helperlandContext.FavoriteAndBlockeds.Where(u => u.UserId == userId && u.TargetUserId == TargetUserId).FirstOrDefault();
            if (favoriteAndBlocked != null)
            {
                System.Console.WriteLine(">>>>>>>>>>>>>>>Sara");
                favoriteAndBlocked.IsBlocked = IsBlocked;
                _helperlandContext.FavoriteAndBlockeds.Update(favoriteAndBlocked);
                _helperlandContext.SaveChanges();
            }
            else
            {
                FavoriteAndBlocked addfavoriteAndBlocked = new FavoriteAndBlocked();
                addfavoriteAndBlocked.UserId = userId;
                addfavoriteAndBlocked.TargetUserId = TargetUserId;
                addfavoriteAndBlocked.IsBlocked = IsBlocked;
                _helperlandContext.FavoriteAndBlockeds.Add(addfavoriteAndBlocked);
                _helperlandContext.SaveChanges();

            }
            return "true";
        }

        public string ChnagePassword(CustomerChangePasswordViewModel customerChangePasswordViewModel)
        {
            if (ModelState.IsValid)
            {
                int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

                var user = _helperlandContext.Users.Where(u => u.UserId == userId).FirstOrDefault();

                if (user != null)
                {
                    string oldPassMd5 = new MD5Hashing().GetMd5Hash(md5Hash, customerChangePasswordViewModel.OldPassword);

                    if (oldPassMd5.Equals(user.Password))
                    {
                        string newPassHash = new MD5Hashing().GetMd5Hash(md5Hash, customerChangePasswordViewModel.NewPassword);
                        user.Password = newPassHash;
                        _helperlandContext.Users.Update(user);
                        _helperlandContext.SaveChanges();
                    }
                    else
                    {
                        return "Incorrect old password";
                    }
                }
                else
                {
                    return "Something is wrong";
                }
            }
            else
            {
                return "Password does not meet minimum requirment";
            }
            return "true";
        }

        public string SPDetails()
        {
            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);
            var user = (from u in _helperlandContext.Users
                            // join a in _helperlandContext.UserAddresses on u.UserId equals a.UserId
                        where u.UserId == userId
                        select new
                        {
                            FirstName = u.FirstName,
                            LastName = u.LastName,
                            Email = u.Email,
                            Mobile = u.Mobile,
                            DateOfBirth = u.DateOfBirth,
                            Gender = u.Gender,
                            AvatarId = u.AvatarId,

                            Address = _helperlandContext.UserAddresses.Where(ua => ua.UserId == userId).FirstOrDefault()

                        });
            if (user != null)
            {
                return JsonSerializer.Serialize(user);
            }
            else
            {
                return "false";
            }
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

        public string UpdateSPDetails(UpdateSPDetailsViewModel updateSPDetailsViewModel)
        {
            if (ModelState.IsValid)
            {
                int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);
                User? user = _helperlandContext.Users.Find(userId);
                if (user != null)
                {
                    user.FirstName = updateSPDetailsViewModel.FirstName;
                    user.LastName = updateSPDetailsViewModel.LastName;
                    user.Mobile = updateSPDetailsViewModel.Mobile;
                    user.DateOfBirth = DateTime.ParseExact(updateSPDetailsViewModel.DateOfBirth, "yyyy-MM-dd", null);
                    user.AvatarId = updateSPDetailsViewModel.AvatarId;
                    user.ZipCode = updateSPDetailsViewModel.ZipCode;

                    user.Gender = updateSPDetailsViewModel.Gender;
                    _helperlandContext.Users.Update(user);
                    _helperlandContext.SaveChanges();

                    UserAddress? userAddress = _helperlandContext.UserAddresses.Where(ua => ua.UserId == userId).FirstOrDefault();

                    if (userAddress != null)
                    {
                        userAddress.AddressLine1 = updateSPDetailsViewModel.AddressLine1;
                        userAddress.AddressLine2 = updateSPDetailsViewModel.AddressLine2;
                        userAddress.PostalCode = updateSPDetailsViewModel.ZipCode;
                        userAddress.City = updateSPDetailsViewModel.City;
                        _helperlandContext.Update(userAddress);
                        _helperlandContext.SaveChanges();
                    }
                    else
                    {
                        userAddress = new UserAddress();
                        userAddress.UserId = userId;
                        userAddress.AddressLine1 = updateSPDetailsViewModel.AddressLine1;
                        userAddress.AddressLine2 = updateSPDetailsViewModel.AddressLine2;
                        userAddress.PostalCode = updateSPDetailsViewModel.ZipCode;
                        userAddress.City = updateSPDetailsViewModel.City;

                        _helperlandContext.Add(userAddress);
                        _helperlandContext.SaveChanges();
                    }
                }
                else
                {
                    return "User not found";
                }
            }
            else
            {
                return "Something is missing";
            }
            return "true";
        }

        public string GetServiceSchedule(int CurrentMonthNo)
        {

            int userId = new CurrentLoggedInUser().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

            var serviceReuest = (from sr in _helperlandContext.ServiceRequests
                                 where sr.ServiceProviderId == userId && (sr.Status == new GlobalData().SERVICE_REQUEST_STATUS_COMPLETED || sr.Status == new GlobalData().SERVICE_REQUEST_STATUS_ACCEPTED)
                                 select new
                                 {
                                     Status = sr.Status,
                                     StartTime = sr.ServiceStartDate,
                                     EndTime = sr.ServiceStartDate.AddHours((double)sr.ExtraHours + sr.ServiceHours),
                                     ServiceDate = sr.ServiceStartDate.Date
                                 }).OrderBy(sr => sr.ServiceDate).ToList();



            DateTime currentDateTime = DateTime.Now;

            DateTime dateTime = new DateTime(currentDateTime.Year, currentDateTime.Month, 1);
            dateTime = dateTime.AddMonths(CurrentMonthNo);

            int startOfDay = (int)dateTime.DayOfWeek;

            if(startOfDay == 0)
                startOfDay = 7;

            List<CalenderViewModel> li = new List<CalenderViewModel>();
            DateTime startDate = dateTime.AddDays(1 - startOfDay);
            for (int i = 1; i <= 42; i++)
            {

                CalenderViewModel c = new CalenderViewModel();
                c.Day = startDate.Day;
                for (int j = 0; j < serviceReuest.Count; j++)
                {
                    if (DateTime.Compare(serviceReuest[j].ServiceDate, startDate) == 0)
                    {
                        c.Status = serviceReuest[j].Status;
                        c.StartTime = serviceReuest[j].StartTime.ToString("HH:mm");
                        c.EndTime = serviceReuest[j].EndTime.ToString("HH:mm");
                    }
                }

                li.Add(c);

                startDate = startDate.AddDays(1);
            }

            var x = new
            {
                Month = dateTime.ToString("MMM"),
                Year = dateTime.Year,
                DayArray = li
            };

            return JsonSerializer.Serialize(x);
        }
    }

}


