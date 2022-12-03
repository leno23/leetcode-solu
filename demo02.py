import requests
import parsel
import os

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
}
def get_tag_detail(url,tag_dir):
    response = requests.get(url=url,headers=headers)
    html = response.text
    # print(html)

    sel = parsel.Selector(html)
    lis = sel.xpath('.//div[@id="post-list"]/ul/li')

    if not os.path.exists(f'jdlingyu/{tag_dir}'):
        os.mkdir(f'jdlingyu/{tag_dir}')
    for li in lis:
        pic_title = li.xpath('.//h2/a/text()').get().split(' ')[0]
        pic_url = li.xpath('.//h2/a/@href').get()

        pic = requests.get(url=pic_url,headers=headers).text

        sel2 = parsel.Selector(pic)

        pic_list = sel2.xpath('.//div[@class="entry-content"]//img/@src').getall()
        if not os.path.exists(f'jdlingyu/{tag_dir}/{pic_title}'):
            try:
                os.mkdir(f'jdlingyu/{tag_dir}/{pic_title}')
            except:
                pass
        for pic in pic_list:
            file_name = pic.split('/')[-1]
            try:
                img_data = requests.get(url = pic,headers=headers).content
                print(file_name)
                with open(f'jdlingyu/{tag_dir}/{pic_title}/{file_name}',mode = 'wb') as f:
                    f.write(img_data)
            except:
                pass

if not os.path.exists('jdlingyu'):
        os.mkdir('jdlingyu')

res = requests.get(url='https://www.jdlingyu.com/tags',headers=headers).text
sel0 = parsel.Selector(res)
tag_list = sel0.xpath('.//main[@class="site-main"]/ul/li')
for tag_li in tag_list[36:]:
    tag_url = tag_li.xpath('.//a/@href').get()
    tag_dir = tag_li.xpath('.//a/h2/text()').get()
    get_tag_detail(tag_url,tag_dir)
    
