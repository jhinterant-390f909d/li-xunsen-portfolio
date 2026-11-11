import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUp, ArrowUpRight, Asterisk, Menu, MoveUpRight, X } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const asset = path => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const projects = [
  { n: '01', type: 'BRAND EXPERIENCE', title: 'LUMIA DERM', sub: '敏感肌屏障修护品牌视觉系统', image: asset('projects/lumia-kv.jpg'), tags: ['品牌视觉', '电商设计', 'AI 创作'], color: 'blue', period: '2026.03 — 2026.05', caseTitle: '以科学之名，温柔以待肌肤。', caseIntro: '围绕敏感肌屏障修护定位，为 LUMIA DERM 建立从品牌视觉识别（VIS）、产品表达至线上传播的完整视觉体验。将皮肤科学的严谨与日常护理的温柔结合，让专业信息更清晰，也让品牌沟通更有温度。详情按原作品集页序呈现。', caseRole: '品牌定位 · VIS 视觉识别 · 产品主视觉 · 电商内容设计', casePages: [...Array.from({length:32}, (_, i) => i + 2), 53] },
  { n: '02', type: 'DIGITAL COMMERCE', title: 'A softer kind of science.', sub: '从产品主图到电商首页的完整体验', image: asset('projects/lumia-commerce.jpg'), tags: ['UI 优化', '内容设计', '数字体验'], color: 'warm', period: '2026.03 — 2026.05', caseTitle: '让每一次浏览，都更安心。', caseIntro: '从用户理解产品的路径出发，梳理神经酰胺、泛醇与积雪草等产品信息，把成分卖点转译为清楚、易读的页面层级。完整呈现作品集中的品牌识别（VIS）、品牌主视觉、商品套组、详情页、活动专题及多平台落地页面，并保持原 PDF 页序。', caseRole: '品牌 VIS · 电商视觉 · 页面信息层级 · 活动视觉 · 多平台内容', casePages: [...Array.from({length:32}, (_, i) => i + 2), 53] },
  { n: '03', type: 'PACKAGING & IDENTITY', title: 'Care, made visible.', sub: '呼噜星球品牌识别与多场景应用', image: asset('projects/lumia-packaging.jpg'), tags: ['包装设计', '品牌识别', '视觉规范'], color: 'silver', period: '2026.05 — 2026.06', caseTitle: '从识别系统，到真实触点。', caseIntro: '完整呈现作品集中的「呼噜星球」品牌识别系统手册与应用页，从个人信息页之后按原 PDF 页序展示标识、色彩、包装、应用延展、电商 Banner、活动海报与门店空间。', caseRole: '品牌 VIS · 色彩规范 · 包装应用 · 营销物料 · 场景展示', casePages: [2,...Array.from({length:20}, (_, i) => i + 34)] },
]

const strengths = [
  ['01', '品牌视觉系统', '从品牌定位与视觉语言出发，建立统一、清晰且可延展的品牌识别。', 'BRAND / IDENTITY', asset('projects/lumia-system.jpg'), 'Refined art direction'],
  ['02', 'AI × 动态创作', '将 AIGC 融入创意构思与视频制作，让品牌内容以更丰富的方式呈现。', 'AI / MOTION', asset('projects/ai-motion.jpg'), 'Generative light study'],
  ['03', '三维产品表现', '使用 Blender 完成产品建模、材质与灯光，让产品质感准确落地。', 'BLENDER / CGI', asset('projects/lumia-detail.jpg'), 'Product / material study'],
  ['04', '数字体验设计', '梳理页面信息层级与视觉节奏，让品牌体验在每个数字触点保持一致。', 'UI / COMMERCE', asset('projects/digital-interface.jpg'), 'Digital experience'],
]

function Grain() { return <div className="grain" aria-hidden="true" /> }

function SpecularButtons() {
  useEffect(() => {
    const selector = '.hero-primary, .carousel-controls button, .all-work, .wireframe-handle'
    let hovered = null, targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = 0
    const activate = root => root.querySelectorAll?.(selector).forEach(element => element.classList.add('specular-target'))
    activate(document)
    const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === 1) { if (node.matches?.(selector)) node.classList.add('specular-target'); activate(node) }
    })))
    observer.observe(document.body, { childList: true, subtree: true })
    const move = event => {
      if (event.pointerType === 'touch') return
      const element = event.target.closest?.(selector)
      if (!element) return
      const rect = element.getBoundingClientRect()
      if (hovered !== element) {
        hovered = element
        currentX = targetX = event.clientX - rect.left
        currentY = targetY = event.clientY - rect.top
      } else {
        targetX = event.clientX - rect.left
        targetY = event.clientY - rect.top
      }
      element.style.setProperty('--specular-opacity', '1')
      if (!frame) frame = requestAnimationFrame(glide)
    }
    const leave = event => {
      const element = event.target.closest?.(selector)
      if (element && !element.contains(event.relatedTarget)) {
        element.style.setProperty('--specular-opacity', '0')
        if (hovered === element) { hovered = null; cancelAnimationFrame(frame); frame = 0 }
      }
    }
    function glide() {
      if (!hovered) { frame = 0; return }
      currentX += (targetX - currentX) * .22
      currentY += (targetY - currentY) * .22
      hovered.style.setProperty('--specular-x', `${currentX}px`)
      hovered.style.setProperty('--specular-y', `${currentY}px`)
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .25) frame = requestAnimationFrame(glide)
      else frame = 0
    }
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', leave, { passive: true })
    return () => { observer.disconnect(); cancelAnimationFrame(frame); document.removeEventListener('pointermove', move); document.removeEventListener('pointerout', leave) }
  }, [])
  return null
}

function ParticleBackdrop() {
  const canvasRef = useRef(null)
  const pointer = useRef({ x: -1000, y: -1000, active: false })
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    let width = 0, height = 0, frame = 0, last = 0, particles = []
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.15)
      width = window.innerWidth; height = window.innerHeight
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(115, Math.max(50, Math.round(width * height / 14500)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        z: .25 + Math.random() * .75, r: .5 + Math.random() * 1.4,
        vx: (Math.random() - .5) * .2, vy: -.08 - Math.random() * .2,
        phase: Math.random() * Math.PI * 2, tint: Math.random()
      }))
    }
    const move = event => { pointer.current = { x: event.clientX, y: event.clientY, active: true } }
    const leave = () => { pointer.current.active = false }
    const draw = time => {
      if (document.hidden) { frame = 0; return }
      if (time - last < 1000 / 30) { frame = requestAnimationFrame(draw); return }
      const dt = Math.min((time - (last || time)) / 16.67, 2); last = time
      ctx.clearRect(0, 0, width, height)
      const reach = Math.min(142, width * .13)
      particles.forEach(p => {
        p.x += p.vx * dt; p.y += p.vy * dt
        if (p.y < -8) { p.y = height + 8; p.x = Math.random() * width }
        if (p.x < -8) p.x = width + 8
        if (p.x > width + 8) p.x = -8
        const dx = pointer.current.x - p.x, dy = pointer.current.y - p.y
        const distance = Math.hypot(dx, dy)
        if (pointer.current.active && distance < reach && distance > 0) {
          const force = (1 - distance / reach) * .42 * dt
          p.x -= dx / distance * force; p.y -= dy / distance * force
        }
      })
      ctx.save(); ctx.globalCompositeOperation = 'lighter'
      const cellSize = 100, buckets = new Map()
      particles.forEach((particle, index) => {
        const key = `${Math.floor(particle.x / cellSize)},${Math.floor(particle.y / cellSize)}`
        if (!buckets.has(key)) buckets.set(key, [])
        buckets.get(key).push(index)
      })
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        const cellX = Math.floor(a.x / cellSize), cellY = Math.floor(a.y / cellSize)
        for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
          const neighbors = buckets.get(`${cellX + ox},${cellY + oy}`) || []
          for (const j of neighbors) if (j > i) {
            const b = particles[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy
            if (d2 < cellSize * cellSize) {
              const alpha = (1 - Math.sqrt(d2) / cellSize) * .19 * Math.min(a.z, b.z)
              ctx.strokeStyle = `rgba(137,211,222,${alpha})`; ctx.lineWidth = .6
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
            }
          }
        }
        if (pointer.current.active) {
          const dx = pointer.current.x - a.x, dy = pointer.current.y - a.y, d = Math.hypot(dx, dy)
          if (d < reach) {
            ctx.strokeStyle = `rgba(174,230,231,${(1 - d / reach) * .3 * a.z})`; ctx.lineWidth = .75
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.current.x, pointer.current.y); ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        const twinkle = .5 + .5 * Math.sin(time * .0012 + p.phase)
        const alpha = (.2 + twinkle * .44) * p.z
        const color = p.tint > .78 ? `rgba(213,205,166,${alpha})` : `rgba(153,218,227,${alpha})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (.8 + twinkle * .42), 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
        if (twinkle > .93) {
          ctx.strokeStyle = `rgba(177,225,231,${(twinkle - .9) * .45})`; ctx.lineWidth = .6
          ctx.beginPath(); ctx.moveTo(p.x - 4, p.y); ctx.lineTo(p.x + 4, p.y); ctx.moveTo(p.x, p.y - 4); ctx.lineTo(p.x, p.y + 4); ctx.stroke()
        }
      })
      ctx.restore(); frame = requestAnimationFrame(draw)
    }
    resize(); frame = requestAnimationFrame(draw)
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0 } else if (!frame) { last = 0; frame = requestAnimationFrame(draw) } }
    window.addEventListener('resize', resize); window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerleave', leave); document.addEventListener('visibilitychange', visibility)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); window.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  return <canvas className="particle-backdrop" ref={canvasRef} aria-hidden="true" />
}

function OceanBackdrop() {
  const canvasRef = useRef(null)
  const targetDepth = useRef(0)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0, height = 0, frame = 0, last = 0, depth = 0
    let streaks = [], plankton = [], clouds = [], reflections = []
    const smooth = value => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t) }
    const mix = (from, to, amount) => from.map((value, index) => Math.round(value + (to[index] - value) * amount))
    const rgba = (rgb, alpha) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.15)
      width = window.innerWidth; height = window.innerHeight
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      streaks = Array.from({length: Math.round(width * .17)}, () => ({ x: Math.random(), y: Math.random(), length: 8 + Math.random() * 70, speed: .006 + Math.random() * .025, phase: Math.random() * 6.28, weight: .15 + Math.random() * .7 }))
      plankton = Array.from({length: Math.round(width * .11)}, () => ({ x: Math.random(), y: Math.random(), size: .5 + Math.random() * 2, speed: .008 + Math.random() * .035, sway: Math.random() * 6.28, alpha: .15 + Math.random() * .65 }))
      clouds = Array.from({length: 28}, () => ({ x: Math.random(), y: .08 + Math.random() * .78, w: .035 + Math.random() * .17, h: .008 + Math.random() * .025, phase: Math.random() * 6.28, alpha: .025 + Math.random() * .065 }))
      reflections = Array.from({length: Math.round(width * .12)}, () => ({ x: .77 + (Math.random() - .5) * .2, y: Math.random(), length: 2 + Math.random() * 28, phase: Math.random() * 6.28, alpha: .12 + Math.random() * .6 }))
    }
    const updateDepth = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight
      targetDepth.current = range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0
    }
    const draw = time => {
      frame = 0
      if (document.hidden) return
      if (!reducedMotion && time - last < 1000 / 30) { frame = requestAnimationFrame(draw); return }
      last = time
      if (reducedMotion) depth = targetDepth.current
      else depth += (targetDepth.current - depth) * .045
      const submerge = smooth(depth / .48)
      const abyss = smooth((depth - .66) / .34)
      const travel = smooth(depth / .62)
      const surfaceY = height * (.43 - travel * 1.32)
      const skyOpacity = 1 - smooth((depth - .025) / .34)
      const oceanTop = mix([25, 75, 98], [5, 34, 52], submerge)
      const oceanBottom = mix([5, 34, 51], [1, 10, 20], submerge)
      const bg = ctx.createLinearGradient(0, 0, 0, height)
      bg.addColorStop(0, rgba([4, 17, 26], 1)); bg.addColorStop(.48, rgba(mix(oceanTop, oceanBottom, .46), 1)); bg.addColorStop(1, rgba(oceanBottom, 1))
      ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height)

      // The opening view holds sky, low sun, horizon and moving ocean in one frame.
      if (surfaceY > 0 && skyOpacity > .001) {
        ctx.save(); ctx.globalAlpha = skyOpacity
        const sky = ctx.createLinearGradient(0, 0, 0, Math.max(surfaceY, 1))
        sky.addColorStop(0, '#78a9ca'); sky.addColorStop(.48, '#acc6d4'); sky.addColorStop(.83, '#f0c49a'); sky.addColorStop(1, '#ffd49f')
        ctx.fillStyle = sky; ctx.fillRect(0, 0, width, surfaceY + 2)

        clouds.forEach(cloud => {
          const x = cloud.x * width + Math.sin(time * .000025 + cloud.phase) * 12
          const y = cloud.y * surfaceY
          const rx = cloud.w * width, ry = Math.max(3, cloud.h * height)
          ctx.save(); ctx.translate(x, y); ctx.scale(rx, ry)
          const haze = ctx.createRadialGradient(0, 0, .05, 0, 0, 1)
          haze.addColorStop(0, `rgba(255,238,219,${cloud.alpha})`); haze.addColorStop(.55, `rgba(255,222,197,${cloud.alpha * .55})`); haze.addColorStop(1, 'rgba(255,222,197,0)')
          ctx.fillStyle = haze; ctx.fillRect(-1, -1, 2, 2); ctx.restore()
        })

        const sunX = width * .78 + Math.sin(time * .000025) * 4
        const sunY = surfaceY * .94
        const glow = ctx.createRadialGradient(sunX, sunY, 1, sunX, sunY, height * .29)
        glow.addColorStop(0, 'rgba(255,242,211,.78)'); glow.addColorStop(.12, 'rgba(255,218,166,.42)'); glow.addColorStop(1, 'rgba(255,202,151,0)')
        ctx.fillStyle = glow; ctx.fillRect(sunX - height * .3, sunY - height * .3, height * .6, height * .6)
        const sunRadius = Math.max(8, height * .027)
        const sunDisc = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius)
        sunDisc.addColorStop(0, 'rgba(255,252,231,.96)'); sunDisc.addColorStop(1, 'rgba(255,226,180,.68)')
        ctx.beginPath(); ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2); ctx.fillStyle = sunDisc; ctx.fill()
        ctx.restore()
      }

      // The horizon travels upward with scroll while rolling bands pass across the surface.
      ctx.save()
      ctx.beginPath(); ctx.moveTo(0, surfaceY)
      for (let x = 0; x <= width; x += 6) {
        const nx = x / width
        const y = surfaceY + Math.sin(nx * 15 + time * .00052) * (4 + (1 - submerge) * 4) + Math.sin(nx * 39 - time * .00031) * 2.2
        ctx.lineTo(x, y)
      }
      ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.closePath(); ctx.clip()
      const water = ctx.createLinearGradient(0, Math.max(0, surfaceY), 0, height)
      water.addColorStop(0, rgba(oceanTop, 1)); water.addColorStop(.46, rgba(mix(oceanTop, oceanBottom, .5), 1)); water.addColorStop(1, rgba(oceanBottom, 1))
      ctx.fillStyle = water; ctx.fillRect(0, Math.max(0, surfaceY - 10), width, height)
      const surface = 1 - smooth((depth - .035) / .42)
      ctx.save(); ctx.globalCompositeOperation = 'screen'
      for (let lane = 0; lane < 16; lane++) {
        const rel = (lane + 1) / 17
        const baseY = Math.max(0, surfaceY) + (height - Math.max(0, surfaceY)) * rel
        const amplitude = (2 + rel * 15) * (1 - submerge * .5)
        ctx.beginPath()
        for (let x = -8; x <= width + 8; x += 7) {
          const nx = x / width
          const y = baseY + Math.sin(nx * (7 + rel * 11) + time * (.0003 + rel * .00012) + lane) * amplitude + Math.sin(nx * 24 - time * .00028 + lane * 1.7) * amplitude * .28
          if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(180,223,230,${(.028 + rel * .085) * surface})`; ctx.lineWidth = .55 + rel * 1.25; ctx.stroke()
      }
      streaks.forEach(streak => {
        const drift = (streak.x + time * .000018 * streak.speed * 45) % 1
        const seaTop = Math.max(0, surfaceY)
        const x = drift * width
        const y = seaTop + streak.y * (height - seaTop) + Math.sin(time * .0003 + streak.phase) * 10
        const shimmer = (.012 + Math.max(0, Math.sin(time * .0013 + streak.phase)) * .1) * surface * streak.weight
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + streak.length * .5, y - 4 + Math.sin(time * .0002 + streak.phase) * 4, x + streak.length, y + 1)
        ctx.strokeStyle = `rgba(210,236,236,${shimmer})`; ctx.lineWidth = .5 + streak.weight * 1.1; ctx.stroke()
      })
      const reflection = skyOpacity * (1 - smooth(depth / .31))
      reflections.forEach(drop => {
        const x = drop.x * width + Math.sin(time * .0008 + drop.phase) * 3
        const seaTop = Math.max(0, surfaceY)
        const y = seaTop + drop.y * (height - seaTop)
        const pulse = .45 + Math.max(0, Math.sin(time * .0014 + drop.phase)) * .55
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + drop.length * (1 + drop.y), y + Math.sin(drop.phase) * 1.5)
        ctx.strokeStyle = `rgba(255,219,158,${reflection * drop.alpha * pulse * .42})`; ctx.lineWidth = .6 + drop.y * 1.3; ctx.stroke()
      })

      // Sunbeams emerge as the lens crosses below the waterline.
      const light = smooth((depth - .06) / .12) * (1 - smooth((depth - .15) / .64))
      for (let ray = 0; ray < 5; ray++) {
        const sourceX = width * (.2 + ray * .15) + Math.sin(time * .00016 + ray) * width * .035
        const rayGradient = ctx.createLinearGradient(sourceX, 0, sourceX + width * .08, height)
        rayGradient.addColorStop(0, `rgba(134,221,231,${.12 * light})`); rayGradient.addColorStop(1, 'rgba(44,135,160,0)')
        ctx.beginPath(); ctx.moveTo(sourceX - width * .018, 0); ctx.lineTo(sourceX + width * .027, 0); ctx.lineTo(sourceX + width * .16, height); ctx.lineTo(sourceX - width * .11, height); ctx.closePath(); ctx.fillStyle = rayGradient; ctx.fill()
      }
      for (let ring = 0; ring < 10; ring++) {
        const cx = width * (.12 + (ring * .173) % .78) + Math.sin(time * .00018 + ring) * 18
        const cy = height * (.18 + (ring * .137) % .56)
        const radius = 32 + ((ring * 47 + time * .014) % 155)
        ctx.beginPath(); ctx.ellipse(cx, cy, radius * 1.55, radius * .48, Math.sin(time * .0001 + ring) * .16, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(105,205,216,${.035 * light})`; ctx.lineWidth = 1.2; ctx.stroke()
      }
      ctx.restore(); ctx.restore()

      // Suspended particles become clearer below the surface.
      const particleVisibility = smooth((depth - .08) / .4)
      ctx.save(); ctx.globalCompositeOperation = 'screen'
      plankton.forEach(particle => {
        const y = ((particle.y - time * .000012 * particle.speed * 55) % 1 + 1) % 1
        const x = particle.x * width + Math.sin(time * .00035 + particle.sway + y * 5) * 11
        const pulse = .4 + Math.max(0, Math.sin(time * .001 + particle.sway)) * .6
        ctx.beginPath(); ctx.arc(x, y * height, particle.size * (1 + submerge), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147,221,225,${particle.alpha * particleVisibility * pulse * .45})`; ctx.fill()
      })
      ctx.restore()

      // A quiet seabed enters only near the end, so the last section still feels underwater.
      if (abyss > .001) {
        const seabedY = height * (.98 - abyss * .19)
        const ridge = (offset, amp, color, alpha) => {
          ctx.beginPath(); ctx.moveTo(0, height)
          for (let x = 0; x <= width; x += 10) {
            const nx = x / width
            const y = seabedY + offset + Math.sin(nx * 7.5 + 1.1) * amp + Math.sin(nx * 18 + 2.8) * amp * .3
            ctx.lineTo(x, y)
          }
          ctx.lineTo(width, height); ctx.closePath(); ctx.fillStyle = rgba(color, alpha * abyss); ctx.fill()
        }
        ridge(12, 24, [2, 10, 17], .72); ridge(34, 34, [1, 6, 12], .9)
        ctx.save(); ctx.globalAlpha = abyss * .55
        for (let rock = 0; rock < 11; rock++) {
          const x = width * (rock / 10) + Math.sin(rock * 7.3) * 23
          const y = seabedY + 20 + Math.sin(rock * 3.2) * 9
          ctx.beginPath(); ctx.ellipse(x, y, 15 + (rock % 4) * 8, 7 + (rock % 3) * 5, Math.sin(rock) * .18, 0, Math.PI * 2)
          ctx.fillStyle = rock % 2 ? '#07151b' : '#0a2028'; ctx.fill()
        }
        ctx.restore()
      }
      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }
    resize(); updateDepth(); frame = requestAnimationFrame(draw)
    const queueDepth = () => { updateDepth(); if (reducedMotion && !document.hidden && !frame) frame = requestAnimationFrame(draw) }
    const onResize = () => { resize(); if (reducedMotion && !frame) frame = requestAnimationFrame(draw) }
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0 } else if (reducedMotion) queueDepth(); else if (!frame) { last = 0; frame = requestAnimationFrame(draw) } }
    window.addEventListener('resize', onResize); window.addEventListener('scroll', queueDepth, {passive:true}); document.addEventListener('visibilitychange', visibility)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', onResize); window.removeEventListener('scroll', queueDepth); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  return <canvas className="ocean-backdrop" ref={canvasRef} aria-hidden="true" />
}

function SmokeField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let frame = 0, width = 0, height = 0, last = 0, puffs = []
    const palette = ['198,205,188', '155,168,151', '207,201,184', '125,139,128']
    const seed = () => Array.from({ length: 38 }, () => ({
      x: .12 + Math.random() * .82,
      t: Math.random(),
      speed: .009 + Math.random() * .018,
      size: Math.min(width, height) * (.1 + Math.random() * .17),
      phase: Math.random() * Math.PI * 2,
      alpha: .45 + Math.random() * .55,
      color: palette[Math.floor(Math.random() * palette.length)],
      tilt: (Math.random() - .5) * .7,
    }))
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = canvas.clientWidth; height = canvas.clientHeight
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      puffs = seed()
    }
    const draw = time => {
      const dt = Math.min((time - (last || time)) / 1000, .04); last = time
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'screen'
      puffs.forEach(puff => {
        puff.t += puff.speed * dt
        if (puff.t > 1) { puff.t = 0; puff.x = .08 + Math.random() * .88; puff.phase = Math.random() * Math.PI * 2 }
        const rise = puff.t
        const sway = Math.sin(time * .00017 + puff.phase + rise * 5) * .075 + Math.sin(time * .00009 + puff.phase) * .04
        const x = (puff.x + sway + Math.sin(rise * 7 + puff.phase) * .025) * width
        const y = (1.12 - rise * 1.34 + Math.sin(rise * 6 + puff.phase) * .025) * height
        const rx = puff.size * (.8 + rise * 1.15)
        const ry = puff.size * (.55 + rise * .7)
        const opacity = Math.sin(Math.PI * rise) * puff.alpha
        ctx.save()
        ctx.translate(x, y); ctx.rotate(puff.tilt + Math.sin(time * .00013 + puff.phase) * .15); ctx.scale(rx, ry)
        const smoke = ctx.createRadialGradient(0, 0, .02, 0, 0, 1)
        smoke.addColorStop(0, `rgba(${puff.color},${.12 * opacity})`)
        smoke.addColorStop(.34, `rgba(${puff.color},${.07 * opacity})`)
        smoke.addColorStop(.72, `rgba(${puff.color},${.022 * opacity})`)
        smoke.addColorStop(1, `rgba(${puff.color},0)`)
        ctx.fillStyle = smoke; ctx.fillRect(-1, -1, 2, 2); ctx.restore()
      })
      ctx.globalCompositeOperation = 'source-over'
      frame = requestAnimationFrame(draw)
    }
    resize(); frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas className="smoke-field" ref={canvasRef} aria-hidden="true" />
}

function InteractionLayer() {
  const [active, setActive] = useState('home')
  const progressRef = useRef(null)
  const coordinateXRef = useRef(null)
  const coordinateYRef = useRef(null)
  useEffect(() => {
    let frame = 0, pointerX = 0, pointerY = 0
    const renderIndicators = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
      if (coordinateXRef.current) coordinateXRef.current.textContent = String(pointerX).padStart(3, '0')
      if (coordinateYRef.current) coordinateYRef.current.textContent = String(pointerY).padStart(3, '0')
    }
    const scheduleIndicators = () => { if (!frame) frame = requestAnimationFrame(renderIndicators) }
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) { setActive(visible.target.id); document.body.dataset.activeSection = visible.target.id; window.dispatchEvent(new Event('sectionchange')) }
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, .2, .45, .7] })
    document.querySelectorAll('main section[id], footer[id]').forEach(section => observer.observe(section))
    window.addEventListener('scroll', scheduleIndicators, { passive: true }); scheduleIndicators()
    const track = e => { pointerX = e.clientX; pointerY = e.clientY; scheduleIndicators() }
    window.addEventListener('pointermove', track, { passive: true })
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', scheduleIndicators); window.removeEventListener('pointermove', track) }
  }, [])
  return <><div ref={progressRef} className="reading-progress" /><div className="cursor-coordinates" aria-hidden="true">X <span ref={coordinateXRef}>000</span> Y <span ref={coordinateYRef}>000</span></div><span className="active-section" aria-hidden="true">{String(['home','about','work','services','contact'].indexOf(active) + 1).padStart(2,'0')} / 05</span></>
}

function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      const opening = gsap.timeline({ defaults: { ease: 'power4.out' } })
      opening
        .fromTo('.header', { y: -34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.05 }, 0)
        .fromTo('.hero-top span', { y: -18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .85, stagger: .1 }, .12)
        .fromTo('.hero .eyebrow', { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .9 }, .25)
        .fromTo('.hero-title-inner', { yPercent: 118, scaleY: .72, scaleX: 1.035, transformOrigin: 'left bottom' }, { yPercent: 0, scaleY: 1, scaleX: 1, duration: 1.35, stagger: .16, ease: 'power4.out' }, .34)
        .fromTo('.hero-bottom', { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.05 }, .9)
        .fromTo('.hero-scroll-cue', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8 }, 1.08)
        .fromTo('.hero-marquee', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power3.inOut' }, .7)

      gsap.utils.toArray('.section-head').forEach(head => {
        const title = head.querySelector('.section-heading-row h2')
        const display = head.querySelector('.section-display-title')
        const kicker = head.querySelector('.section-kicker')
        const detail = head.querySelector('.section-heading-row > p')
        const tl = gsap.timeline({
          scrollTrigger: { trigger: head, start: 'top 78%', once: true },
          defaults: { ease: 'power4.out' },
        })
        if (kicker) tl.fromTo(kicker, { x: -24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .75 }, 0)
        if (display) tl.fromTo(display, { yPercent: 95, scaleX: .88, transformOrigin: 'left center' }, { yPercent: 0, scaleX: 1, duration: 1.2 }, .08)
        if (title) tl.fromTo(title, { y: 74, scaleY: .82, transformOrigin: 'left bottom', autoAlpha: 0 }, { y: 0, scaleY: 1, autoAlpha: 1, duration: 1.12 }, .2)
        if (detail) tl.fromTo(detail, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .85 }, .42)
      })

      const about = document.querySelector('.about-grid')
      if (about) {
        const portrait = about.querySelector('.portrait-image')
        const photo = about.querySelector('.portrait-photo')
        const copy = about.querySelector('.about-copy')
        const texts = copy?.querySelectorAll('.mono-label, .about-lead, .about-body, .about-meta, .contact-lines')
        const stats = about.querySelectorAll('.stat')
        if (portrait) gsap.fromTo(portrait, { clipPath: 'inset(0 0 100% 0)', y: 58 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: about, start: 'top 72%', once: true } })
        if (photo) gsap.fromTo(photo, { scale: 1.12 }, { scale: 1, duration: 1.65, ease: 'power3.out', scrollTrigger: { trigger: about, start: 'top 72%', once: true } })
        if (texts?.length) gsap.fromTo(texts, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .85, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: copy, start: 'top 78%', once: true } })
        if (stats.length) gsap.fromTo(stats, { x: 36, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .9, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: about.querySelector('.stats-rail'), start: 'top 82%', once: true } })
      }

      const film = document.querySelector('.scroll-film')
      if (film) {
        const intro = film.querySelector('.carousel-intro')
        const cards = film.querySelectorAll('.carousel-card')
        const controls = film.querySelector('.carousel-controls')
        if (intro) gsap.fromTo(intro.children, { y: 54, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: .12, ease: 'power4.out', scrollTrigger: { trigger: intro, start: 'top 80%', once: true } })
        if (cards.length) gsap.fromTo(cards, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.25, stagger: .13, ease: 'power4.inOut', scrollTrigger: { trigger: film, start: 'top 70%', once: true } })
        if (controls) gsap.fromTo(controls, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: controls, start: 'top 92%', once: true } })
      }

      const cards = gsap.utils.toArray('.project-card')
      cards.forEach(card => {
        const image = card.querySelector('.project-image')
        const info = card.querySelector('.project-info')
        const picture = image?.querySelector('img')
        if (image) gsap.fromTo(image, { clipPath: 'inset(10% 0 90% 0)', y: 48 }, { clipPath: 'inset(0% 0 0% 0)', y: 0, duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: card, start: 'top 82%', once: true } })
        if (info) gsap.fromTo(info.children, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .82, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: info, start: 'top 92%', once: true } })
        if (picture) gsap.fromTo(picture, { '--scroll-parallax': '14px' }, { '--scroll-parallax': '-14px', ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .9 } })
      })

      const skillCards = gsap.utils.toArray('.strength-card')
      if (skillCards.length) {
        gsap.fromTo(skillCards, { y: 76, rotateX: 7, transformPerspective: 900, autoAlpha: 0 }, { y: 0, rotateX: 0, autoAlpha: 1, duration: 1.05, stagger: .16, ease: 'power4.out', scrollTrigger: { trigger: '.strength-grid', start: 'top 78%', once: true } })
        skillCards.forEach(card => {
          const visual = card.querySelector('.strength-visual')
          const image = visual?.querySelector('img')
          if (visual) gsap.fromTo(visual, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.inOut', scrollTrigger: { trigger: '.strength-grid', start: 'top 75%', once: true, delay: .12 } })
          if (image) gsap.fromTo(image, { scale: 1.14 }, { scale: 1.04, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: '.strength-grid', start: 'top 75%', once: true } })
        })
      }

      const contact = document.querySelector('.contact')
      if (contact) {
        const kicker = contact.querySelector('.section-kicker')
        const display = contact.querySelector('.section-display-title')
        const main = contact.querySelector('.contact-main')
        const title = contact.querySelector('.contact-main h2')
        const footer = contact.querySelector('.contact-bottom')
        if (kicker) gsap.fromTo(kicker, { x: -28, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: contact, start: 'top 75%', once: true } })
        if (display) gsap.fromTo(display, { yPercent: 95, scaleX: .88, transformOrigin: 'left center' }, { yPercent: 0, scaleX: 1, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: contact, start: 'top 75%', once: true } })
        if (main) gsap.fromTo(main.children, { y: 64, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: .16, ease: 'power4.out', scrollTrigger: { trigger: main, start: 'top 78%', once: true } })
        if (title) gsap.fromTo(title, { clipPath: 'inset(0 0 100% 0)', scaleY: .8, transformOrigin: 'left bottom' }, { clipPath: 'inset(0 0 0% 0)', scaleY: 1, duration: 1.35, ease: 'power4.inOut', scrollTrigger: { trigger: title, start: 'top 82%', once: true } })
        if (footer) gsap.fromTo(footer.children, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .8, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: footer, start: 'top 95%', once: true } })
      }
    })
    return () => ctx.revert()
  }, [])
  return null
}

function WireframeHandle({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    let startX = 0, startY = 0, baseX = 0, baseY = 0, dragging = false
    const down = e => { if (e.button !== 0) return; dragging = true; startX = e.clientX; startY = e.clientY; const rect = el.getBoundingClientRect(); baseX = rect.left; baseY = rect.top; el.style.right = 'auto'; el.style.bottom = 'auto'; el.style.left = `${baseX}px`; el.style.top = `${baseY}px`; el.classList.add('is-dragging'); el.setPointerCapture(e.pointerId) }
    const move = e => { if (!dragging) return; el.style.left = `${baseX + e.clientX - startX}px`; el.style.top = `${baseY + e.clientY - startY}px` }
    const up = () => { dragging = false; el.classList.remove('is-dragging') }
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up)
    return () => { el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up) }
  }, [])
  return <div ref={ref} className={`wireframe-handle ${className}`}>{children}</div>
}

function ParticleField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let frame, points = [], width, height
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = canvas.clientWidth; height = canvas.clientHeight
      canvas.width = width * dpr; canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      points = Array.from({ length: Math.round(width / 14) }, (_, i) => ({
        x: (i / Math.round(width / 14)) * width,
        y: height * (.5 + Math.sin(i * .11) * .12 + Math.cos(i * .027) * .095),
        p: Math.random() * Math.PI * 2,
        speed: .003 + Math.random() * .007,
        amp: 14 + Math.random() * 36,
      }))
    }
    const draw = (t) => {
      ctx.clearRect(0, 0, width, height)
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, 'rgba(194,207,167,0)')
      gradient.addColorStop(.5, 'rgba(194,207,167,.22)')
      gradient.addColorStop(1, 'rgba(149,169,142,.01)')
      ctx.beginPath()
      points.forEach((pt, i) => {
        const y = pt.y + Math.sin(t * pt.speed + pt.p) * pt.amp
        if (!i) ctx.moveTo(pt.x, y); else ctx.lineTo(pt.x, y)
        if (i % 5 === 0) {
          ctx.fillStyle = `rgba(220,226,197,${.13 + Math.sin(t * .001 + pt.p) * .1})`
          ctx.fillRect(pt.x, y, 1.5, 1.5)
        }
      })
      ctx.strokeStyle = gradient; ctx.lineWidth = 1; ctx.stroke()
      frame = requestAnimationFrame(draw)
    }
    resize(); frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />
}

function Header() {
  const [open, setOpen] = useState(false)
  const [, setActive] = useState('home')
  useEffect(() => { const update = () => setActive(document.body.dataset.activeSection || 'home'); window.addEventListener('sectionchange', update); return () => window.removeEventListener('sectionchange', update) }, [])
  const links = [['关于', '#about'], ['项目', '#work'], ['能力', '#services']]
  return <header className="header shell">
    <a href="#home" className="wordmark" aria-label="回到首页"><span className="wordmark-icon">L<span>.</span></span><span>LI XUNSEN<small>INDEPENDENT DESIGNER</small></span></a>
    <nav className={open ? 'nav nav-open' : 'nav'}>{links.map(([label, href], i) => <a className={activeNav(href) ? 'active' : ''} key={label} href={href} onClick={() => setOpen(false)}><i>0{i + 1}</i>{label}</a>)}</nav>
    <button className="menu-toggle" aria-label={open ? '关闭菜单' : '打开菜单'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </header>
}

function activeNav(href) { return typeof document !== 'undefined' && document.body.dataset.activeSection === href.slice(1) }

function Hero() {
  return <section className="hero" id="home">
    <div className="hero-media"><div className="hero-glow"/><div className="hero-vignette"/></div>
    <div className="hero-top shell"><span>PORTFOLIO / 2026</span><span>BASED IN CHINA · AVAILABLE WORLDWIDE</span></div>
    <div className="hero-content shell">
      <p className="eyebrow"><span className="status-dot"/> VISUAL DESIGNER · AI CREATOR · BRAND DESIGNER</p>
      <h1><span className="hero-title-mask"><span className="hero-title-inner">Designing</span></span><span className="hero-title-mask"><span className="title-line hero-title-inner"><em>with</em> <b>intention.</b></span></span></h1>
      <div className="hero-bottom"><p>用视觉建立感知，<br/>让品牌在数字世界里被看见。</p><div className="hero-actions"><a className="hero-primary" href="#work">查看作品 <ArrowUpRight size={15}/></a></div></div>
    </div>
    <a className="hero-scroll-cue" href="#work"><span>SCROLL DOWN TO EXPLORE</span><ArrowDown size={14}/></a>
    <div className="hero-marquee" aria-label="品牌设计，视觉系统，AI 动态创作，数字体验"><div className="hero-marquee-track"><span>BRAND DESIGN <i>✳</i> VISUAL SYSTEMS <i>✳</i> AI IN MOTION <i>✳</i> DIGITAL EXPERIENCES <i>✳</i> BRAND DESIGN <i>✳</i> VISUAL SYSTEMS <i>✳</i> AI IN MOTION <i>✳</i> DIGITAL EXPERIENCES <i>✳</i></span><span aria-hidden="true">BRAND DESIGN <i>✳</i> VISUAL SYSTEMS <i>✳</i> AI IN MOTION <i>✳</i> DIGITAL EXPERIENCES <i>✳</i> BRAND DESIGN <i>✳</i> VISUAL SYSTEMS <i>✳</i> AI IN MOTION <i>✳</i> DIGITAL EXPERIENCES <i>✳</i></span></div></div>
    <div className="hero-vertical">VISUAL COMMUNICATION / BRAND / AI</div>
  </section>
}

function ScrollFilm() {
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState(null)
  const drag = useRef({ x: 0, moved: false })
  const items = [
    { ...projects[0], displayTitle: 'Science, made softer.', note: 'LUMIA DERM · 品牌视觉识别与数字体验' },
    { ...projects[1], image: asset('projects/lumia-detail.jpg'), displayTitle: 'A closer look at care.', note: '以清晰的视觉讲述产品与成分' },
    { ...projects[2], displayTitle: 'Care, made visible.', note: '呼噜星球 · 品牌识别与多场景应用' },
  ]
  const step = direction => setActive(current => (current + direction + items.length) % items.length)
  const startDrag = event => { drag.current = { x: event.clientX, moved: false }; event.currentTarget.setPointerCapture(event.pointerId) }
  const moveDrag = event => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const delta = event.clientX - drag.current.x
    if (Math.abs(delta) > 32) { step(delta < 0 ? 1 : -1); drag.current.x = event.clientX; drag.current.moved = true }
  }
  return <section className="scroll-film" aria-label="精选项目环形轮播">
    <div className="carousel-intro shell"><div className="section-kicker"><span>01</span><span className="kicker-rule"/><span>SELECTED CASE STUDIES</span></div><div className="section-display-title" aria-hidden="true">SELECTED WORK</div><h2>从视觉概念，<em>到完整体验。</em></h2><p>拖动浏览项目，点击卡片查看完整作品集。</p></div>
    <div className="circular-carousel" onPointerDown={startDrag} onPointerMove={moveDrag} onKeyDown={event => { if (event.key === 'ArrowLeft') step(-1); if (event.key === 'ArrowRight') step(1) }} tabIndex={0} aria-roledescription="carousel">
      <div className="carousel-ring" style={{ transform: `translateZ(-330px) rotateY(${-active * 120}deg)` }}>
        {items.map((item, index) => <button type="button" className={`carousel-card ${index === active ? 'is-active' : ''}`} key={item.n} style={{ transform: `rotateY(${index * 120}deg) translateZ(330px)` }} onClick={() => { if (drag.current.moved) { drag.current.moved = false; return }; if (index !== active) setActive(index); else setSelected(item) }} aria-label={`${index === active ? '打开' : '聚焦'}项目：${item.title}`}>
          <img src={item.image} alt="" draggable="false" loading="lazy" decoding="async"/><span className="carousel-shade"/><span className="carousel-meta">{item.n} / SELECTED WORK <ArrowUpRight size={17}/></span><span className="carousel-copy"><small>CASE STUDY / 2026</small><strong>{item.displayTitle}</strong><em>{item.note}</em></span>
        </button>)}
      </div>
    </div>
    <div className="carousel-controls"><button type="button" onClick={() => step(-1)} aria-label="上一个项目"><ArrowRight className="flip-arrow" size={16}/></button><span>0{active + 1} <i>/</i> 0{items.length}</span><button type="button" onClick={() => step(1)} aria-label="下一个项目"><ArrowRight size={16}/></button></div>
    {selected && <ProjectCaseStudy project={selected} onClose={() => setSelected(null)} onNavigate={setSelected}/>}
  </section>
}

function SectionHead({ index, label, title, detail }) {
  return <div className="section-head"><div className="section-kicker"><span>{index}</span><span className="kicker-rule"/><span>{label}</span></div><div className="section-display-title" aria-hidden="true">{label}</div><div className="section-heading-row"><h2>{title}</h2>{detail && <p>{detail}</p>}</div></div>
}

function About() {
  return <section id="about" className="about section-pad shell">
    <SectionHead index="01" label="A LITTLE ABOUT ME" title={<>视觉之上，<br/><span>还有更多可能。</span></>} detail="A designer working across identities, interfaces and emerging tools." />
    <div className="about-grid">
      <div className="portrait-card"><div className="portrait-image"><img className="portrait-photo" src={asset('portrait.jpg')} alt="黎训森的黑白生活照" width="826" height="1111" loading="lazy" decoding="async"/><div className="portrait-label">FIG. 01 — THE DESIGNER</div><div className="portrait-coords">LI XUNSEN<br/>VISUAL DESIGNER</div></div><div className="portrait-caption"><span>LI XUNSEN</span><span>VISUAL THINKER · DETAIL OBSERVER</span></div></div>
      <div className="about-copy"><span className="mono-label">THE PERSON BEHIND THE PIXELS</span><p className="about-lead">你好，我是<strong>黎训森</strong>。<br/>一名关注品牌与数字体验的视觉设计师。</p><p className="about-body">毕业于桂林理工大学视觉传达设计专业。近年持续探索品牌视觉、电商体验与 AI 内容创作之间的连接。从一个清晰的想法开始，把它变成细节完整、真实可用的视觉体验。</p><p className="about-body">我相信好的设计不需要大声解释。它让信息更清楚，让品牌更可信，也让每一次接触都刚刚好。</p>
        <div className="about-meta"><div><span>EDUCATION</span><b>桂林理工大学 · 视觉传达设计</b></div><div><span>FOCUS</span><b>品牌设计 / AI 创作 / 数字体验</b></div></div>
        <div className="contact-lines"><a href="mailto:2879071642@qq.com">2879071642@qq.com <ArrowUpRight size={14}/></a><a href="tel:+8613788315021">+86 137 8831 5021 <ArrowUpRight size={14}/></a></div>
      </div>
      <div className="stats-rail"><div className="stat"><b>03<span>+</span></b><small>完整品牌 / 电商项目</small></div><div className="stat"><b>04</b><small>年视觉设计学习与实践</small></div><div className="stat-note"><Asterisk size={16}/><span>从品牌第一印象<br/>到真实使用场景</span></div></div>
    </div>
  </section>
}

function ProjectCard({ project, onOpen }) {
  const handleMove = e => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--pointer-x', `${((e.clientX - rect.left) / rect.width - .5) * 8}px`); e.currentTarget.style.setProperty('--pointer-y', `${((e.clientY - rect.top) / rect.height - .5) * 8}px`) }
  const resetMove = e => { e.currentTarget.style.setProperty('--pointer-x', '0px'); e.currentTarget.style.setProperty('--pointer-y', '0px') }
  return <article className={`project-card ${project.color}`}><a href={`#project-${project.n}`} className="project-image" onClick={e => { e.preventDefault(); onOpen(project) }} onPointerMove={handleMove} onPointerLeave={resetMove}><img src={project.image} alt={`${project.title} — ${project.sub}`} loading="lazy" decoding="async"/><div className="image-shade"/><div className="project-number">{project.n} <span> / SELECTED WORK</span></div><div className="project-open"><span>VIEW CASE</span><ArrowUpRight size={17}/></div><div className="project-image-title"><span>CASE STUDY / 2026</span><h3>{project.title}</h3></div></a><div className="project-info"><div><span className="project-type">{project.type}</span><p>{project.sub}</p></div><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>
}

function Work() {
  const [selected, setSelected] = useState(null)
  useEffect(() => {
    if (!selected) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => {
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') setSelected(current => projects[(projects.findIndex(p => p.n === current.n) + 1) % projects.length])
      if (e.key === 'ArrowLeft') setSelected(current => projects[(projects.findIndex(p => p.n === current.n) - 1 + projects.length) % projects.length])
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prevOverflow; window.removeEventListener('keydown', onKey) }
  }, [selected])
  return <section id="work" className="work section-pad"><div className="shell"><SectionHead index="02" label="SELECTED PROJECTS" title={<>一些想法，<span>成为了现实。</span></>} detail="Selected brand and digital experiences, shaped with clarity and care."/><div className="projects-grid">{projects.map(p => <ProjectCard project={p} key={p.n} onOpen={setSelected}/>)}</div><button type="button" className="all-work" onClick={() => setSelected(projects[0])}>想看看更多项目？ <span>查看完整作品集</span><ArrowUp size={15}/></button></div>{selected && <ProjectCaseStudy project={selected} onClose={() => setSelected(null)} onNavigate={setSelected}/>}</section>
}

function ProjectCaseStudy({ project, onClose, onNavigate }) {
  const detailRef = useRef(null)
  useEffect(() => { if (detailRef.current) detailRef.current.scrollTop = 0 }, [project.n])
  const pageTitle = {
    1: '作品集封面 / PORTFOLIO', 2: '个人信息 / PERSONAL INFORMATION', 3: '品牌设计章节目录', 4: '品牌设计章节页', 5: 'LUMIA DERM 品牌理念',
    6: 'LUMIA DERM 品牌视觉识别', 7: 'LUMIA DERM 品牌视觉识别', 8: 'LUMIA DERM 品牌视觉识别', 9: 'LUMIA DERM 品牌视觉识别', 10: 'LUMIA DERM 品牌视觉识别', 11: 'LUMIA DERM 品牌视觉识别', 12: 'LUMIA DERM 品牌视觉识别', 13: 'LUMIA DERM 品牌视觉识别', 14: 'LUMIA DERM 品牌视觉识别', 15: 'LUMIA DERM 品牌视觉识别', 16: 'LUMIA DERM 品牌视觉识别', 17: 'LUMIA DERM 品牌视觉识别', 18: 'LUMIA DERM 品牌视觉识别', 19: 'LUMIA DERM 品牌视觉识别', 20: 'LUMIA DERM 品牌视觉识别', 21: 'LUMIA DERM 品牌视觉识别',
    22: '用户画像与产品沟通重点', 23: '品牌主视觉 KV', 24: '核心单品视觉', 25: '产品系列组合', 26: '活动专题视觉', 27: '详情页 · 轻盈质地', 28: '详情页 · 水润修护', 29: '详情页 · 舒适肤感', 30: '详情页 · 神经酰胺', 31: '详情页 · 泛醇舒缓', 32: '多平台电商落地', 33: '项目视觉总览', 34: '呼噜星球品牌手册封面', 35: '呼噜星球品牌目录', 36: '品牌色彩系统', 37: '标识应用规范', 38: '品牌识别细节', 39: '视觉规范延展', 40: '产品包装展示', 41: '产品系列展示', 42: '产品应用展示', 43: '包装视觉展示', 44: '品牌色彩应用', 45: '品牌应用延展', 46: '品牌传播物料', 47: '品牌场景应用', 48: '线下应用延展', 49: '应用场景组合', 50: '电商首页 Banner', 51: '品牌活动海报', 52: '门店空间体验', 53: '作品集致谢页',
  }
  const [currentIndex, setCurrentIndex] = useState(projects.findIndex(item => item.n === project.n))
  useEffect(() => setCurrentIndex(projects.findIndex(item => item.n === project.n)), [project.n])
  const go = delta => { const next = (currentIndex + delta + projects.length) % projects.length; onNavigate(projects[next]); setCurrentIndex(next) }
  return <div className="case-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}><div className="case-window" role="dialog" aria-modal="true" aria-labelledby="case-title" ref={detailRef}>
    <div className="case-toolbar"><div className="case-brand"><span className="case-brand-mark">L.</span><span>PROJECT / {project.n}<small>SELECTED WORK · 2026</small></span></div><div className="case-toolbar-center"><span className="toolbar-dot"/> CASE STUDY VIEW</div><button className="case-close" onClick={onClose} aria-label="关闭项目详情">关闭 <X size={16}/><kbd>ESC</kbd></button></div>
    <div className="case-content"><div className="case-heading"><div><span className="case-eyebrow">{project.type} <i/> {project.period}</span><h2 id="case-title">{project.caseTitle}</h2><p>{project.caseIntro}</p></div><div className="case-role"><span>MY CONTRIBUTION</span><b>{project.caseRole}</b><div className="case-tags">{project.tags.map(tag => <em key={tag}>{tag}</em>)}</div></div></div>
      <div className="case-pages">{project.casePages.map((page, i) => <figure className="case-page" key={page}><figcaption><span>{String(i + 1).padStart(2,'0')} <i/> {pageTitle[page] || '品牌视觉应用'}</span><span>PORTFOLIO / {String(page).padStart(2,'0')}</span></figcaption><img src={asset(`project-pages/page-${page}.jpg`)} alt={`${project.title} 项目内容：${pageTitle[page] || '品牌视觉应用'}`} loading={i < 2 ? 'eager' : 'lazy'} decoding="async"/></figure>)}</div>
      <div className="case-end"><span>END OF PROJECT / {project.n}</span><span>THANK YOU FOR SCROLLING</span></div>
    </div>
    <div className="case-footer"><button onClick={() => go(-1)}><ArrowRight className="flip-arrow" size={15}/> PREVIOUS PROJECT</button><span>{String(currentIndex + 1).padStart(2,'0')} <i>/</i> 0{projects.length}</span><button onClick={() => go(1)}>NEXT PROJECT <ArrowRight size={15}/></button></div>
  </div></div>
}

function Services() {
  return <section id="services" className="services section-pad shell"><SectionHead index="03" label="WHAT I BRING" title={<>不止一种方法，<br/><span>把事情做好。</span></>} detail="A multidisciplinary toolkit for thoughtful, end-to-end work."/><div className="strength-grid">{strengths.map(([n,title,desc,tag,image,caption]) => <article className="strength-card" key={n}><div className="strength-top"><span>{n} / 04</span><ArrowUpRight size={16}/></div><div className="strength-visual"><img src={image} alt={caption} loading="lazy" decoding="async"/><span>{caption}</span></div><h3>{title}</h3><p>{desc}</p><span className="strength-tag">{tag}</span></article>)}</div><div className="tools-line"><span>TOOLS I WORK WITH</span><div>BLENDER <i>·</i> FIGMA <i>·</i> ADOBE CC <i>·</i> GENERATIVE AI <i>·</i> AFTER EFFECTS</div></div></section>
}

function Contact() {
  return <footer id="contact" className="contact"><div className="contact-bg" style={{ '--contact-image': `url("${asset('contact-music-collage.png')}")` }}><div className="contact-ring ring-one"/><div className="contact-ring ring-two"/><div className="contact-ring ring-three"/><div className="contact-star">✳</div></div><div className="contact-inner shell"><div className="section-kicker"><span>04</span><span className="kicker-rule"/><span>HAVE A PROJECT IN MIND?</span></div><div className="section-display-title" aria-hidden="true">GET IN TOUCH</div><div className="contact-main"><p>VISUAL DESIGN · BRAND IDENTITY · AI CREATION</p><h2>让想法<br/><em>拥有自己的视觉。</em></h2><p className="contact-manifesto">品牌识别、数字体验与生成式创作。<br/>从清晰的概念出发，把每个细节落到真实触点。</p></div><div className="contact-bottom"><a href="mailto:2879071642@qq.com">2879071642@qq.com</a><div className="social-links"><a href="tel:+8613788315021">电话 <ArrowUpRight size={13}/></a><a href="mailto:2879071642@qq.com">邮件 <ArrowUpRight size={13}/></a></div><span>© 2026 LI XUNSEN · VISUAL DESIGN PORTFOLIO</span><a href="#home" className="back-top">返回顶部 <ArrowDownRight size={14}/></a></div></div></footer>
}

function App() {
  return <><OceanBackdrop/><ParticleBackdrop/><Grain/><SpecularButtons/><InteractionLayer/><Header/><main><Hero/><ScrollFilm/><About/><Work/><Services/></main><Contact/><ScrollReveal/><WireframeHandle className="floating-note"><span className="note-grip">⠿</span><span>DESIGN IN PROGRESS</span><span className="note-dot"/></WireframeHandle></>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
