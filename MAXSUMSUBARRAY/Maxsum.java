public class Maxsum
{
 public static int crosssum(int a[],int low,int mid,int high)
 {   
    //int left_sum=Integer.MIN_VALUE;
    int sum=0,left_sum=-999999;
    for(int i=mid;i>=low;i--)
    {
        sum=sum+a[i];
        if(sum>left_sum)
        left_sum=sum;
    }
    int sum1=0,right_sum=-999999;
    for(int i=mid+1;i<=high;i++)
    {
        sum1=sum1+a[i];
        if(sum1>right_sum)
        right_sum=sum1;
    }
    return left_sum+right_sum;

 }


 public static int max_sum(int a[],int low,int high)
 {
    if(low==high)
    {
        return a[low];
    }
    int mid=(low+high)/2;
    int left_sum=max_sum(a,low,mid);
    int right_sum=max_sum(a,mid+1,high);
    int crosssum=crosssum(a,low,mid,high);
    if(left_sum>=right_sum && left_sum>=crosssum)
    return left_sum;
    else if(left_sum>=right_sum && left_sum>=crosssum)
    return right_sum;
    else
    return crosssum;
 }



}