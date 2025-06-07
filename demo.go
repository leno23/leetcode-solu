package main
import "fmt"
func main() {
	fmt.Println("'hello world'", 123)
	var f,g=1,'a'
	fmt.Println("f=", f,g)
	for j:= range 3{
		if j%2==0 {
			continue
		}
		fmt.Println("j=", j)
	}

	var a= [...]int{1, 2:100,300}
	var b [2][3]int
	fmt.Println("a=", a)
	fmt.Println("b=", b)
	var s []string
	fmt.Println("s=", s)
	s=make([]string, 3, 5)
	s=append(s,"hello")
	s=append(s,"hello2")
	s=append(s,"hello3")

	s[0]="world"
	s[1]="hello"
	fmt.Println("s=", s, len(s),cap(s))

	m := map[string]int{"k2": 2, "k1": 1}
	_, prs := m["k2"]
    fmt.Println("prs:", prs)
}