# image_to_tile_sever

输入超大分辨率图片，输出瓦片图并提供瓦片图 web 服务

## Why ?

超大分辨率图片在客户端展示，对于网络及客户端本身的性能都构成很大压力，借由大多数地图类应用的瓦片图处理方式，所构建的服务 

## Usage

`docker pull aute/image_to_tile_sever`

`docker run -p 48888:8080 -v /Users/yourname/data/tile_server_files:/usr/app/files -d aute/tile_sever`

这里将内部 `/usr/app/files` 映射到了 `/Users/yourname/data/tile_server_files` 

若 `tile_server_files`  原本为空目录，则会自动创建 `tile_server_files/input` 和 `tile_server_files/output`

将需处理图片拷贝至 tile_server_files/input 如

`tile_server_files/input/8811.png`

并向服务发送 put 请求如:

 `http://localhost:48888/original_image`

`body:{
	"original_image_file_name": "8811.png"
}`

处理结果将输出至 `tile_server_files/output` 如：

`tile_server_files/output/8811`

处理结果可通过 http 访问如：

```jsx
<TileLayer url='http://localhost:48888/8811/{z}/{y}/{x}.png' />
```

