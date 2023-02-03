#include <iostream>

using namespace std;

int main(){
  int n=5,m=5;
  char a[n][m]={'.'};
  for(int i=0;i<n;i++){
    for(int j=0;j<m;j++){
      a[i][j]='.';
      printf("%c ",a[i][j]);
    }
    printf("\n");
  }
  int num=0;
  char player='O';
  while(num<25){
    printf("%c enter:",player);
    int a,b;
    scanf("%d%d",&a,&b);
    if(a<=0 || a> n || b<=0 || b>m){
      printf("输入不合法，请重新输入");
      continue;
    }
    for(int i=0;i<5;i++){
      for(int j=0;j<5;j++){
        if(a-1==i && b-1==j) a[i][j]='O';
        printf("%c ",a[i][j]);
      }
      printf("\n");
    }
    printf("%d %d\n",a,b);
  }
  return 0;
}

