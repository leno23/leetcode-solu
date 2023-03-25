 题目描述 
小明负责维护项目下的代码，需要查找出重复代码，用以支撑后续的代码优化，请你帮助小明找出重复的代码。 重复代码查找方法：以字符串形式给定两行代码（字符串长度 1 < length <= 100，由英文字母、数字和空格组成），找出两行代码中的最长公共子串。 注：如果不存在公共子串，返回空字符串 
 
输入描述 
输入的参数text1, text2分别表示两行代码 
 
输出描述 
输出任一最长公共子串 
 
用例 
输入hello123world hello123abc4输出hello123说明无
输入private_void_method public_void_method输出_void_method说明无
输入hiworld hiweb输出hiw说明无
 