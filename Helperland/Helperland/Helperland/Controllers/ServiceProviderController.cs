using Helperland.Data;
using Helperland.Functionality;
using Helperland.GlobalVariable;
using Helperland.Models;
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
                                   where sReq.Status == new GlobalData().SERVICE_REQUEST_STATUS_NEW
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

                var newService = _helperlandContext.ServiceRequests.Where(sr => sr.ServiceRequestId == serviceId && sr.Status == new GlobalData().SERVICE_REQUEST_STATUS_NEW).FirstOrDefault();
                if (newService != null)
                {
                    int noOfServiceConflicting = _helperlandContext.ServiceRequests.Where(sr => sr.ServiceProviderId == userId && sr.Status == new GlobalData().SERVICE_REQUEST_STATUS_ACCEPTED &&
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
    }
}
