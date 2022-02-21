using Helperland.Data;
using Helperland.Functionality;
using Helperland.GlobalVariable;
using Helperland.Models;
using Helperland.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Helperland.Controllers
{
    public class CustomerController : Controller
    {
        HelperlandContext _helperlandContext;

        public CustomerController(HelperlandContext helperlandContext)
        {
            _helperlandContext = helperlandContext;
        }
        public IActionResult BookService()
        {
            int? UsertypeId = new KeepMeLoggedInValidToken().GetUserTypeId(Request.Cookies["keepMeLoggedInToken"]);
            if (UsertypeId != null)
            {
                if (UsertypeId == new GlobalData().CustomerTypeId)
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

        public string IsValidPostalCode(string PostalCode)
        {

            int count = _helperlandContext.Users.Where(u => u.ZipCode == PostalCode && u.UserTypeId == new GlobalData().SpTypeId).Select(u => u.ZipCode).Count();

            if (count != 0)
            {
                return "true";
            }
            else
            {
                return "false";
            }
        }

        public string GetUserAddresses(string postalCode)
        {

            int? userId = new KeepMeLoggedInValidToken().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

            return JsonSerializer.Serialize(_helperlandContext.UserAddresses.Where(u => u.UserId == userId && u.PostalCode == postalCode).ToList());
        }

        public string SaveUserAddress(NewAddressBookServiceViewModel newAddressBookServiceViewModel)
        {
            UserAddress userAddress = new UserAddress();
            userAddress.UserId = new KeepMeLoggedInValidToken().GetUserId(Request.Cookies["keepMeLoggedInToken"]);
            userAddress.AddressLine1 = newAddressBookServiceViewModel.StreetName;
            userAddress.AddressLine2 = newAddressBookServiceViewModel.HouseNumber;
            userAddress.PostalCode = newAddressBookServiceViewModel.PostalCode;
            userAddress.City = newAddressBookServiceViewModel.City;
            userAddress.Mobile = newAddressBookServiceViewModel.Phone;

            _helperlandContext.UserAddresses.Add(userAddress);
            int x = _helperlandContext.SaveChanges();

            return "" + x;
        }

        public string GetFevoriteServiceProviders(string data)
        {
            int? userId = new KeepMeLoggedInValidToken().GetUserId(Request.Cookies["keepMeLoggedInToken"]);

            var fevSPListBookServiceViewModel = (from f in _helperlandContext.FavoriteAndBlockeds
                                                                                                                      join u in _helperlandContext.Users
                                                                                                                      on f.TargetUserId equals u.UserId
                                                                                                                      where f.UserId == userId && f.IsFavorite == true && f.IsBlocked == false
                                                                                                                      select new
                                                                                                                      {
                                                                                                                          TargetUserID = u.UserId,
                                                                                                                          TargetUserName = u.FirstName + " " + u.LastName
                                                                                                                      }).ToList();

            return JsonSerializer.Serialize(fevSPListBookServiceViewModel);
        }

        public string CompleteBooking(CompleteBookingViewModel completeBookingViewModel)
        {
            int serviceRequestId;
            if (ModelState.IsValid)
            {
                int userId = new KeepMeLoggedInValidToken().GetUserId(Request.Cookies["keepMeLoggedInToken"]);
                string userName = new KeepMeLoggedInValidToken().GetName(Request.Cookies["keepMeLoggedInToken"]);

                _helperlandContext.ServiceRequests.Add(new CompleteBookingRepository().GetServiceRequest(completeBookingViewModel, userId));
                int noOfRowsChanged = _helperlandContext.SaveChanges();

                if (noOfRowsChanged >= 1)
                {
                    serviceRequestId = _helperlandContext.ServiceRequests.Where(u => u.UserId == userId).Max(u => u.ServiceRequestId);

                    if (completeBookingViewModel.ExtraHoursList != null)
                    {
                        for (int i = 0; i < completeBookingViewModel.ExtraHoursList.Length; i++)
                        {
                            ServiceRequestExtra serviceRequestExtra = new ServiceRequestExtra();
                            serviceRequestExtra.ServiceRequestId = serviceRequestId;
                            serviceRequestExtra.ServiceExtraId = completeBookingViewModel.ExtraHoursList[i];

                            _helperlandContext.ServiceRequestExtras.Add(serviceRequestExtra);
                        }
                        _helperlandContext.SaveChanges();
                    }

                    UserAddress? userAddress = _helperlandContext.UserAddresses.Where(u => u.AddressId == completeBookingViewModel.AddressId).FirstOrDefault();

                    if (userAddress != null)
                    {
                        ServiceRequestAddress serviceRequestAddress = new ServiceRequestAddress();
                        serviceRequestAddress.ServiceRequestId = serviceRequestId;
                        serviceRequestAddress.AddressLine1 = userAddress.AddressLine1;
                        serviceRequestAddress.AddressLine2 = userAddress.AddressLine2;
                        serviceRequestAddress.City = userAddress.City;
                        serviceRequestAddress.Mobile = userAddress.Mobile;
                        serviceRequestAddress.PostalCode = userAddress.PostalCode;
                        _helperlandContext.ServiceRequestAddresses.Add(serviceRequestAddress);
                        _helperlandContext.SaveChanges();
                    }
                    else
                    {
                        return "false";
                    }

                    /*
                        Sending Email to service provider
                    */
                    // MailRequest mailRequest = new MailRequest();
                    // if (completeBookingViewModel.FevServiceProviderID != null)
                    // {

                    //     var fevSP = _helperlandContext.Users.Where(u => u.UserId == completeBookingViewModel.FevServiceProviderID).Select(u => new { u.Email, u.FirstName, u.LastName }).FirstOrDefault();

                    //     mailRequest.SendEmail(fevSP.Email, fevSP.FirstName + " " + fevSP.LastName, "New Service Request",
                    //     "Hello,\n" +
                    //     fevSP.FirstName + " " + fevSP.LastName + "\n\n" +
                    //     userName + " has booked service at:\n" +
                    //     userAddress.AddressLine1 + ", " + userAddress.AddressLine2 + "\n" +
                    //     userAddress.City + "-" + userAddress.PostalCode + "\n" +
                    //     userAddress.Mobile);
                    // }
                    // else
                    // {
                    //     var spList = _helperlandContext.Users.Where(u => u.ZipCode == userAddress.PostalCode && u.UserTypeId == new GlobalData().SpTypeId).Select(u => new { u.Email, u.FirstName, u.LastName }).ToList();

                    //     for (int i = 0; i < spList.Count; i++)
                    //     {
                    //         var fevSP = spList[i];
                    //         mailRequest.SendEmail(fevSP.Email, fevSP.FirstName + " " + fevSP.LastName, "New Service Request",
                    //         "Hello,\n" +
                    //         fevSP.FirstName + " " + fevSP.LastName + "\n\n" +
                    //         userName + " has booked service at:\n" +
                    //         userAddress.AddressLine1 + ", " + userAddress.AddressLine2 + "\n" +
                    //         userAddress.City + "-" + userAddress.PostalCode + "\n" +
                    //         userAddress.Mobile);
                    //     }
                    // }

                }
                else
                {
                    return "false";
                }
            }
            else
            {
                return "false";
            }

            return "" + serviceRequestId;
        }
    }
}
