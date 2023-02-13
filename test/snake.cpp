//1.蛇的生成
//2.食物的生成
//3.边界的生成
//4.开始游戏
//5.控制蛇的移动方向
//    a>若蛇吃到食物，身体+1，食物重新生成
//    b>若蛇碰到墙壁或碰到自己身体,死亡
//  c>蛇死亡之后打印分数
//6.游戏结束
#define _CRT_SECURE_NO_WARNINGS
#include<stdio.h>
#include<string.h>
#include<stdlib.h>
#include <windows.h>
#include <conio.h>
#include<time.h>
#define HIGH 20
#define WIDTH 50

struct BODY {
    int x;
    int y;
};

struct SNAKE {
    BODY body[WIDTH*HIGH];//身体
    int size;//记录蛇的长度
    int score;//记录获得的分数
    COORD coord;//光标的位置信息
    //定义蛇的方向
    int dx;//dx为正则向右，为负则向左
    int dy;//dy为正则向下，为负则向上
    BODY tial; //记录蛇的尾巴
    BODY food;//定义食物
};

void _init_snake(SNAKE* snake) {
    //初始化蛇头
    snake->body[0].x = WIDTH / 2;
    snake->body[0].y = HIGH / 2;
    //初始化蛇尾坐标
    snake->body[1].x = WIDTH / 2 - 1;
    snake->body[1].y = HIGH / 2;
    snake->size = 2;
    snake->score = 0;

    snake->dx = 1;//初始化蛇向右移动
    snake->dy = 0;

    snake->tial.x = snake->body[snake->size - 1].x;
    snake->tial.y = snake->body[snake->size - 1].y;
}
void hide_cur()
{
    //隐藏控制台光标
    CONSOLE_CURSOR_INFO  cci;
    cci.dwSize = sizeof(cci);
    cci.bVisible = FALSE;
    SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cci);
}
void _init_food(SNAKE * snake) {
    srand(time(NULL));//设置随机数种子
    snake->food.x = rand() % WIDTH;
    snake->food.y = rand() % HIGH;
}
void _init_well() {
    for (int i = 0; i <= HIGH; i++) {
        for (int j = 0; j <= WIDTH; j++) {
            if (i == HIGH || j == WIDTH) {
                printf("+");
            }
            else {
                printf(" ");
            }
        }
        printf("\n");
    }
}
void show_snake(SNAKE *snake) {
    //显示蛇 注意: 每次显示蛇或食物,都要设置显示的位置,(光标的位置)
    for (int i = 0; i < snake->size; i++) {
        snake->coord.X = snake->body[i].x;
        snake->coord.Y = snake->body[i].y;
        SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), snake->coord);
        if (i == 0) {
            printf("@");
        }
        else {
            printf("*");
        }
    }
    snake->coord.X = snake->tial.x;
    snake->coord.Y = snake->tial.y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), snake->coord);
    printf(" ");

}
void show_food(SNAKE * snake) {
    snake->coord.X = snake->food.x;
    snake->coord.Y = snake->food.y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE),snake->coord);
    printf("#");
    hide_cur();
}
void control_snake(SNAKE *snake,int &sleepTime) {
    char  key = 0;
    while (_kbhit()) //判断是否按下按键,按下不等于0 
    {
        key = _getch();
    }
    if (key == 'a') {
        if (snake->dx == -1) {
            sleepTime = 50;
        }
        else {
            snake->dx = -1;
            snake->dy = 0;
        }
    }
    if (key == 'w') {
        if (snake->dy == -1) {
            sleepTime = 50;
        }
        else {
            snake->dx = 0;
            snake->dy = -1;
        }
    }
    if (key == 's') {
        if (snake->dy == 1) {
            sleepTime = 50;
        }
        else {
            snake->dx = 0;
            snake->dy = 1;
        }

    }
    if (key == 'd') {
        if (snake->dx == 1) {
            sleepTime = 50;
        }
        else {
            snake->dx = 1;
            snake->dy = 0;
        }
    }
}

void show_ui(SNAKE *snake) {
    //显示蛇的位置
    show_snake(snake);
    //显示食物的位置
    show_food(snake);
}
void game_end(SNAKE *snake) {
    //结束游戏
    COORD coord;
    coord.X = 5;
    coord.Y = 23;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
    printf("游戏结束，您的得分是：%d\n", snake->score);
    Sleep(3000);
    exit(0);//退出进程
}
void snake_eat_body(SNAKE *snake) {
    //校验蛇碰到自己
    for (int i = 1; i < snake->size - 1; i++) {
        if (snake->body[0].x ==snake->body[i].x && snake->body[0].y == snake->body[i].y) {
            game_end(snake);
        }
    }
}

void snake_move(SNAKE *snake) {
    //蛇的尾部改变
    snake->tial.x = snake->body[snake->size - 1].x;
    snake->tial.y = snake->body[snake->size - 1].y;

    //蛇头后面的身体每一节为前一节位置
    for (int i = snake->size - 1; i > 0; i--) {
        snake->body[i].x = snake->body[i - 1].x;
        snake->body[i].y = snake->body[i - 1].y;
    }
    //蛇头因方向而改变
    snake->body[0].x += snake->dx;
    snake->body[0].y += snake->dy;
}
void snake_eat_food(SNAKE * snake) {
    //判断蛇吃食物
    if (snake->body[0].x == snake->food.x&&snake->body[0].y == snake->food.y) {
        snake->size +=1;
        snake->score += 10;
        _init_food(snake);
    }
}

void _game_start(SNAKE *snake,int sleepTime) {
    //初始化食物
    _init_food(snake);
    _init_snake(snake);
    while (snake->body[0].x<WIDTH&& snake->body[0].x>0 && snake->body[0].y<HIGH&&snake->body[0].y>0) {

        //控制蛇的身体
        control_snake(snake,sleepTime);
        //蛇的移动
        snake_move(snake);
        //蛇是否碰到自己
        snake_eat_body(snake);
        //判断蛇吃食物
        snake_eat_food(snake);
        //显示
        show_ui(snake);
        Sleep(sleepTime);//延时0.3s
        
        //重置移动速度
        sleepTime = 300;
    }
    //游戏结束
    game_end(snake);
}

int main() {
    //申请蛇的空间
    SNAKE *snake = (SNAKE *)malloc(sizeof(SNAKE));
    //初始化墙
    _init_well();
    //初始化休眠时间（便于设置加速）
    int sleepTime = 300;
    _game_start(snake,sleepTime);
    system("pause");
}