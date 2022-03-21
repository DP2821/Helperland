namespace Helperland.GlobalVariable
{
    public class GlobalData
    {
       
        public int CustomerTypeId { get; } = 1;
        public int SpTypeId { get; } = 2;
        public int AdminTypeId { get; } = 3;

        public int SERVICE_HOURLY_RATE { get; } = 18;    
        public int SERVICE_REQUEST_STATUS_NEW { get; } = 1;
        public int SERVICE_REQUEST_STATUS_COMPLETED { get; } = 2;
        public int SERVICE_REQUEST_STATUS_CANCELLED { get; } = 3;
        public int SERVICE_REQUEST_STATUS_ACCEPTED { get; } = 4;

        public int ACCOUNT_STATUS_ACTIVE { get; } = 1;
        public int ACCOUNT_STATUS_DEACTIVE { get; } = 2;

    }
}
