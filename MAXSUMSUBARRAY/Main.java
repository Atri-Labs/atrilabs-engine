public class Main {
    public static void main(String args[])
    {
        int a[]={-7,12,3,-9,6,15,-4,10};
        int low=0,high=7;
        int sum=Maxsum.max_sum(a, low, high);
        System.out.println("Maximum sum sub array is:"+sum);
    }


}
