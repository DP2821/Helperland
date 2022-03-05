using Helperland.Data;
using Helperland.GlobalVariable;

namespace Helperland.Models.ViewModel
{
    public class CompleteBookingRepository : GlobalData
    {
        HelperlandContext _helperlandContext = new HelperlandContext();

        public ServiceRequest GetServiceRequest(CompleteBookingViewModel completeBookingViewModel, int userId){

            ServiceRequest serviceRequest = new ServiceRequest();

            serviceRequest.UserId = userId;
            if (_helperlandContext.ServiceRequests.Max(u => (int?)u.ServiceRequestId) == null)
            {
                serviceRequest.ServiceId = 1;
            }
            else
            {
                serviceRequest.ServiceId = (int)(_helperlandContext.ServiceRequests.Max(u => u.ServiceRequestId) + 1);
            }
            serviceRequest.ServiceStartDate = DateTime.ParseExact(completeBookingViewModel.ServiceStartDate, "yyyy-MM-dd HH:mm",null);
            serviceRequest.ZipCode = completeBookingViewModel.ZipCode;
            serviceRequest.ServiceHourlyRate = SERVICE_HOURLY_RATE;
            serviceRequest.ServiceHours = completeBookingViewModel.ServiceHours;
            if(completeBookingViewModel.ExtraHoursList != null){
                serviceRequest.ExtraHours = completeBookingViewModel.ExtraHoursList.Length / 2.0;
                serviceRequest.SubTotal = (decimal)(completeBookingViewModel.ServiceHours + completeBookingViewModel.ExtraHoursList.Length / 2.0) * SERVICE_HOURLY_RATE;
                serviceRequest.TotalCost = (decimal)(completeBookingViewModel.ServiceHours + completeBookingViewModel.ExtraHoursList.Length / 2.0) * SERVICE_HOURLY_RATE;
            }
            else{
                serviceRequest.ExtraHours = 0;
                serviceRequest.SubTotal = (decimal)(completeBookingViewModel.ServiceHours * SERVICE_HOURLY_RATE);
                serviceRequest.TotalCost = (decimal)(completeBookingViewModel.ServiceHours * SERVICE_HOURLY_RATE);
            }
            serviceRequest.Discount = 0;
            serviceRequest.Comments = completeBookingViewModel.Comments;
            if(completeBookingViewModel.FevServiceProviderID != null){
                serviceRequest.ServiceProviderId = completeBookingViewModel.FevServiceProviderID;
            }
            serviceRequest.HasPets = completeBookingViewModel.HasPets;
            serviceRequest.Status = SERVICE_REQUEST_STATUS_NEW;
            serviceRequest.CreatedDate = DateTime.Now;
            serviceRequest.ModifiedDate = DateTime.Now;
            serviceRequest.ModifiedBy = userId;
            serviceRequest.Distance = 0;
            
            return serviceRequest;
        }
    }
}