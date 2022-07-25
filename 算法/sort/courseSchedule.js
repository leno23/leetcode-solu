/*
  207. 课程表

  你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。

  在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，
  其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。

  例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
  请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。
*/
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
 var canFinish = function (numCourses, prerequisites) {
  let indexg = Array(numCourses).fill(0)
  let g = Array(numCourses).fill().map(() => [])
  let q = []
  for (let x of prerequisites) {
      indexg[x[0]] += 1;
      g[x[1]].push(x[0])
  }
  for (let i = 0; i < numCourses; i++) {
      if (indexg[i] == 0) q.push(i)
  }
  let cnt = 0
  while (q.length) {
      let ind = q.shift()
      cnt++
      for (let to of g[ind]) {
          indexg[to]--
          if (indexg[to] == 0) q.push(to)
      }
  }
  return cnt == numCourses
};