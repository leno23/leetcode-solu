#include <stdio.h>

int main(){
    int num=0,num1=0;
    printf("enter a number:");
    scanf("%d", &num);
    printf("num is%d\n",num);

    // 
    scanf("%*[^\n]");
    scanf("%*c");

    printf("enter a number2:");
    scanf("%d", &num1);
    printf("num2 is%d\n",num1);
    return 0;
}