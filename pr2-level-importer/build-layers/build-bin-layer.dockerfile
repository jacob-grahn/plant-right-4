FROM amazonlinux
WORKDIR root

RUN yum install zip wget tar gzip -y && \
    mkdir -p lib && \
    mkdir -p bin

RUN cp /usr/lib64/libblkid.so.1 /usr/lib64/libmount.so.1 /usr/lib64/libuuid.so.1 /root/lib/

RUN wget https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.0.3-linux-x86-64.tar.gz && \
    tar -xzf libwebp-1.0.3-linux-x86-64.tar.gz && \
    cp libwebp-1.0.3-linux-x86-64/bin/cwebp /root/bin/

RUN ls && zip -r bin.zip lib bin
# RUN yum install zip gcc-c++ cairo-devel libjpeg-turbo-devel libpng-devel libxi-dev pango-devel giflib-devel -y
# RUN yum groupinstall "Development Tools" -y
