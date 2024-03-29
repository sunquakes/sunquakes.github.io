#!/usr/bin/env bash

DIR="${0%/*}"

title=`echo $@`
filename=`echo $@ | sed 's/[ ][ ]*/-/g'`
post_date=`date  +"%Y-%m-%d %T"`
post_name="`date "+%Y-%m-%d"`-${filename}.markdown"
random_addr=`openssl rand -hex 8 | md5 | cut -c1-8`

cat > ${DIR}/_posts/${post_name} << EOF
---
layout: post
title:  "${title}"
description: ""
date:   ${post_date} +0800
categories: default
permalink: /posts/${random_addr}/
author: Shing 
tags: [writing]
---


<!--more-->
EOF